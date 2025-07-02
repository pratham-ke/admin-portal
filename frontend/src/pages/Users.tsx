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
  Alert,
  TableSortLabel,
  TablePagination,
  Switch,
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
import { useAuth } from '../contexts/AuthContext';
import Menu from '@mui/material/Menu';
import MenuItemMui from '@mui/material/MenuItem';
import apiClient from '../services/apiClient';
import ConfirmDialog from '../components/ConfirmDialog';

// --- Embedded User Service ---
const userService = {
  getUsers: () => apiClient.get('/users'),
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
  toggleUserStatus: (id: string) => apiClient.patch(`/users/${id}/toggle-active`),
};
// -------------------------

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  image?: string;
}

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=User&background=random&size=40';

const getImageUrl = (image: string | undefined) => {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//.test(image)) return image;
  return `http://localhost:5000/uploads/user/${image}`;
};

const USERS_ROWS_PER_PAGE_KEY = 'usersRowsPerPage';
const USERS_PAGE_KEY = 'usersPage';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const { token, user } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof User>('username');
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem(USERS_ROWS_PER_PAGE_KEY);
    return saved ? parseInt(saved, 10) : 10;
  });
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem(USERS_PAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUserId, setMenuUserId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteUserId(id);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (deleteUserId !== null) {
      try {
        await userService.deleteUser(String(deleteUserId));
        fetchUsers();
      } catch (error) {
        setError('Failed to delete user');
      }
    }
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  };

  const handleToggleActive = async (id: number) => {
    try {
      await userService.toggleUserStatus(String(id));
      // Optimistic update
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (error) {
      setError('Failed to toggle user status');
      // Revert optimistic update on error
      fetchUsers();
    }
  };

  const handleRequestSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    localStorage.setItem(USERS_PAGE_KEY, newPage.toString());
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
    localStorage.setItem(USERS_ROWS_PER_PAGE_KEY, value.toString());
    localStorage.setItem(USERS_PAGE_KEY, '0');
  };

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

  function getComparator<Key extends keyof User>(order: 'asc' | 'desc', orderBy: Key): (a: User, b: User) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Filter out the currently logged-in user
  const filteredUsers = users.filter(u => u.id !== user?.id);
  const sortedUsers = users.slice().sort((a, b) => getComparator(order, orderBy)(a, b));
  const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleExpand = (userId: number) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const handleEdit = (id: number) => {
    navigate(`/users/edit/${id}`);
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
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
            onClick={() => navigate('/users/add')}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sortDirection={orderBy === 'username' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? order : 'asc'}
                  onClick={() => handleRequestSort('username')}
                >
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'email' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'role' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'role'}
                  direction={orderBy === 'role' ? order : 'asc'}
                  onClick={() => handleRequestSort('role')}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'isActive' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'isActive'}
                  direction={orderBy === 'isActive' ? order : 'asc'}
                  onClick={() => handleRequestSort('isActive')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <React.Fragment key={user.id}>
                <TableRow hover>
                  <TableCell>
                    <img src={getImageUrl(user.image)} alt={user.username} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isActive}
                      onChange={() => handleToggleActive(user.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleExpand(user.id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, user.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={menuUserId === user.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItemMui onClick={() => handleEdit(user.id)} sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                      </MenuItemMui>
                      <MenuItemMui onClick={() => handleDeleteClick(user.id)} sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                      </MenuItemMui>
                    </Menu>
                  </TableCell>
                </TableRow>
                {expandedUserId === user.id && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6">User Details</Typography>
                        <Typography><strong>Email:</strong> {user.email}</Typography>
                        <Typography><strong>Role:</strong> {user.role}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmButtonText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default Users; 