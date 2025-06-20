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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await axios.put(
          `http://localhost:5000/api/portfolio/${selectedItem.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/portfolio', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleClose();
      fetchItems();
    } catch (error) {
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
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
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
        <form onSubmit={handleSubmit}>
          <DialogContent>
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
            <TextField
              fullWidth
              label="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              margin="normal"
            />
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