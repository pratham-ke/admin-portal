// List.tsx
// Portfolio items list page for the admin portal.
// Displays all portfolio items in a table with options to view, edit, or delete.
// Fetches portfolio data from the API and manages user actions.

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TableSortLabel,
  TablePagination,
  Menu,
  MenuItem as MenuItemMui,
  Switch,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import ConfirmDialog from '../../components/ConfirmDialog';

// --- Embedded Portfolio Service ---
const portfolioService = {
  getItems: () => apiClient.get('/v1/portfolio?admin=true'),
  deleteItem: (id: string) => apiClient.delete(`/v1/portfolio/${id}`),
  toggleItemStatus: (id: string) => apiClient.patch(`/v1/portfolio/${id}/toggle-status`),
  toggleVisibility: (id: string) => apiClient.patch(`/v1/portfolio/${id}/toggle-visibility`),
};
// --------------------------------

interface PortfolioItem {
  id: number;
  name: string;
  image: string;
  category: string;
  status: 'Active' | 'Exit';
  isVisible: boolean;
}

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Portfolio&background=random&size=48';

const getImageUrl = (image: string | undefined) => {
    if (!image) return DEFAULT_IMAGE;
    if (/^https?:\/\//.test(image)) return image;
    return `http://localhost:5000/uploads/portfolio/${image}`;
};

const PORTFOLIO_ROWS_PER_PAGE_KEY = 'portfolioRowsPerPage';
const PORTFOLIO_PAGE_KEY = 'portfolioPage';

const Portfolio: React.FC = () => {
  // --- State management ---
  // State for portfolio data, loading, error, etc.
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const { token } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof PortfolioItem>('name');
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem(PORTFOLIO_ROWS_PER_PAGE_KEY);
    return saved ? parseInt(saved, 10) : 10;
  });
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem(PORTFOLIO_PAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItemId, setMenuItemId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  // --- Data fetching ---
  // Fetches the list of portfolio items from the API
  const fetchItems = async () => {
    try {
      const response = await portfolioService.getItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      setError('Failed to fetch portfolio items.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- Handlers for actions (edit, delete, etc.) ---
  // Handler for opening the delete confirmation dialog
  const handleDeleteClick = (id: number) => {
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  // Handler for confirming the delete action
  const handleDeleteConfirm = async () => {
    if (deleteItemId !== null) {
      try {
        await portfolioService.deleteItem(String(deleteItemId));
        fetchItems();
      } catch (error) {
        setError('Failed to delete item.');
      }
    }
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  // Handler for cancelling the delete action
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  // Handler for toggling the status of a portfolio item
  const handleToggleStatus = async (id: number) => {
    // Optimistic update
    const originalItems = [...items];
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, status: item.status === 'Active' ? 'Exit' : 'Active' } : item
      )
    );

    try {
      await portfolioService.toggleItemStatus(String(id));
    } catch (error) {
        console.error('Error toggling status:', error);
        setError('Failed to toggle status');
        // Revert on error
        setItems(originalItems);
    }
  };

  // Handler for toggling the visibility of a portfolio item
  const handleToggleVisibility = async (id: number) => {
    // Optimistic update
    const originalItems = [...items];
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
    try {
      await portfolioService.toggleVisibility(String(id));
    } catch (error) {
      setError('Failed to toggle visibility');
      setItems(originalItems);
    }
  };

  // Handler for sorting the portfolio items
  const handleRequestSort = (property: keyof PortfolioItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handler for changing the page of portfolio items
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    localStorage.setItem(PORTFOLIO_PAGE_KEY, newPage.toString());
  };

  // Handler for changing the number of rows per page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
    localStorage.setItem(PORTFOLIO_ROWS_PER_PAGE_KEY, value.toString());
    localStorage.setItem(PORTFOLIO_PAGE_KEY, '0');
  };

  // Helper function for sorting items
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
    }
    if (bValue == null) return -1;
    if (aValue == null) return 1;
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  }

  // Helper function for getting a comparator based on sort order
  function getComparator<Key extends keyof PortfolioItem>(order: 'asc' | 'desc', orderBy: Key): (a: PortfolioItem, b: PortfolioItem) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Sort and paginate the items
  const sortedItems = items.slice().sort((a,b) => getComparator(order, orderBy)(a,b));
  const paginatedItems = sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Handler for opening the menu for a portfolio item
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, itemId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuItemId(itemId);
  };

  // Handler for closing the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItemId(null);
  };

  // Handler for editing a portfolio item
  const handleEdit = (id: number) => {
    navigate(`/portfolio/edit/${id}`);
    handleMenuClose();
  };

  // --- Render ---
  // Renders the portfolio items table and action buttons
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Portfolio Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/portfolio/add')}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Image</TableCell>
              <TableCell sortDirection={orderBy === 'name' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'category' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={() => handleRequestSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>Visible</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <img src={getImageUrl(item.image)} alt={item.name} style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.isVisible}
                    onChange={() => handleToggleVisibility(item.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 12px',
                    borderRadius: 16,
                    background: item.status === 'Active' ? '#4caf50' : '#b71c1c',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 13,
                  }}>
                    {item.status === 'Active' ? 'ACTIVE' : 'EXIT'}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/portfolio/view/${item.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={(event) => handleMenuOpen(event, item.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuItemId === item.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItemMui
                      onClick={() => handleEdit(item.id)}
                      sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}
                    >
                      <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                    </MenuItemMui>
                    <MenuItemMui
                      onClick={() => handleDeleteClick(item.id)}
                      sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}
                    >
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                    </MenuItemMui>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Portfolio Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmButtonText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default Portfolio; 