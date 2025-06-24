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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Menu from '@mui/material/Menu';
import MenuItemMui from '@mui/material/MenuItem';

interface PortfolioItem {
  id: number;
  portfolio_id: string;
  name: string;
  description: string;
  overview: string;
  image: string;
  category: string;
  year: number;
  website: string;
  status: 'Exit' | 'Active';
}

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Portfolio&background=random&size=48';

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    name: '',
    description: '',
    overview: '',
    image: '',
    category: '',
    year: new Date().getFullYear(),
    website: '',
    status: 'Active',
  });
  const { token } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof PortfolioItem>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItemId, setMenuItemId] = useState<number | null>(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const handleOpen = (item?: PortfolioItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData(item);
      setImagePreview(
        isValidImageField(item.image)
          ? (/^https?:\/\//.test(item.image)
              ? item.image
              : `http://localhost:5000/uploads/portfolio/${item.image}`)
          : null
      );
      setImageFile(null);
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        description: '',
        overview: '',
        image: '',
        category: '',
        year: new Date().getFullYear(),
        website: '',
        status: 'Active',
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name || !formData.description || !formData.category) {
      setFormError('Name, Description, and Category are required.');
      return;
    }
    try {
      const data = new FormData();
      // Handle required fields
      data.append('name', formData.name || '');
      data.append('description', formData.description || '');
      data.append('category', formData.category || '');
      data.append('status', formData.status || 'Active');
      
      // Handle optional fields - convert empty strings to null
      data.append('overview', formData.overview || '');
      data.append('year', formData.year ? String(formData.year) : '');
      data.append('website', formData.website || '');
      
      if (imageFile) {
        data.append('image', imageFile);
      }
      if (selectedItem) {
        await axios.put(
          `http://localhost:5000/api/portfolio/${selectedItem.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/portfolio', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      handleClose();
      fetchItems();
    } catch (error) {
      setFormError('Error saving portfolio item. Please try again.');
      console.error('Error saving portfolio item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/portfolio/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchItems();
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
      }
    }
  };

  const handleRequestSort = (property: keyof PortfolioItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(order: 'asc' | 'desc', orderBy: Key): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const sortedItems = items.slice().sort(getComparator(order, orderBy));
  const paginatedItems = sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  function isValidImageField(image: string | undefined): boolean {
    if (!image) return false;
    // Accept if it looks like a filename (has an image extension) or is a URL
    return /\.(jpg|jpeg|png|gif)$/i.test(image) || /^https?:\/\//.test(image);
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, itemId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItemId(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Portfolio Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Project
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
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
              <TableCell sortDirection={orderBy === 'year' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'year'}
                  direction={orderBy === 'year' ? order : 'asc'}
                  onClick={() => handleRequestSort('year')}
                >
                  Year
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'status' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item: PortfolioItem, idx: number) => (
              <TableRow key={item.id}>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>
                  {isValidImageField(item.image) ? (
                    <img
                      src={/^https?:\/\//.test(item.image) ? item.image : `http://localhost:5000/uploads/portfolio/${item.image}`}
                      alt={item.name}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE; }}
                    />
                  ) : (
                    <img
                      src={DEFAULT_IMAGE}
                      alt={item.name}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                    />
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/portfolio/view/${item.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={(e) => handleMenuOpen(e, item.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuItemId === item.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItemMui
                      onClick={() => {
                        handleMenuClose();
                        handleOpen(item);
                      }}
                    >
                      <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                    </MenuItemMui>
                    <MenuItemMui
                      onClick={() => {
                        handleMenuClose();
                        handleDelete(item.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                    </MenuItemMui>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={items.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
        </DialogTitle>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <DialogContent>
            {formError && (
              <Box sx={{ mb: 2 }}>
                <Typography color="error">{formError}</Typography>
              </Box>
            )}
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Overview"
              value={formData.overview}
              onChange={(e) =>
                setFormData({ ...formData, overview: e.target.value })
              }
              margin="normal"
              multiline
              rows={4}
            />
            <Box sx={{ my: 2 }}>
              <Button
                variant="outlined"
                component="label"
                sx={{ mr: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE; }}
                />
              ) : (
                <img
                  src={DEFAULT_IMAGE}
                  alt="Preview"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                />
              )}
            </Box>
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: Number(e.target.value) })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'Exit' | 'Active',
                  })
                }
                label="Status"
              >
                <MenuItem value="Exit">Exit</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedItem ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Portfolio; 