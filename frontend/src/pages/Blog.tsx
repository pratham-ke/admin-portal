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
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient';

// --- Embedded Blog Service ---
const blogService = {
  getPosts: () => apiClient.get('/blog'),
  deletePost: (id: string) => apiClient.delete(`/blog/${id}`),
  togglePostStatus: (id: string) => apiClient.patch(`/blog/${id}/toggle-status`),
};
// --------------------------

interface BlogPost {
  id: number;
  title: string;
  image: string;
  category: string;
  status: 'draft' | 'published';
}

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Blog&background=random&size=48';

const getImageUrl = (image: string | undefined) => {
    if (!image) return DEFAULT_IMAGE;
    if (/^https?:\/\//.test(image)) return image;
    return `http://localhost:5000/uploads/blog/${image}`;
};

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { token } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof BlogPost>('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await blogService.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to fetch blog posts.');
    }
  };

  useEffect(() => {
    if(token) {
      fetchPosts();
    }
  }, [token]);

  const handleDelete = async (id: number) => {
    handleMenuClose();
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deletePost(String(id));
        fetchPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        setError('Failed to delete blog post.');
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await blogService.togglePostStatus(String(id));
      // Optimistic update
      setPosts(prevPosts =>
        prevPosts.map(p => (p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p))
      );
    } catch (error) {
        console.error('Error toggling status:', error);
        setError('Failed to toggle status');
        // Revert on error
        fetchPosts();
    }
  };

  const handleRequestSort = (property: keyof BlogPost) => {
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

  type Order = 'asc' | 'desc';

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const sortedPosts = React.useMemo(() => {
    if (!posts) return [];
    const comparator = getComparator(order, orderBy);
    return [...posts].sort(comparator);
  }, [posts, order, orderBy]);

  const paginatedPosts = sortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, postId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPostId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Blog Management
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
            onClick={() => navigate('/blog/add')}
          >
            Add Blog Post
          </Button>
        </Box>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleRequestSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'category'}
                    direction={orderBy === 'category' ? order : 'asc'}
                    onClick={() => handleRequestSort('category')}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell>Image</TableCell>
                <TableCell>
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
              {paginatedPosts.map((post, index) => (
                <TableRow key={post.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <img src={getImageUrl(post.image)} alt={post.title} style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }} />
                  </TableCell>
                  <TableCell>
                  <Switch
                      checked={post.status === 'published'}
                      onChange={() => handleToggleStatus(post.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton onClick={() => navigate(`/blog/view/${post.id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, post.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuPostId === post.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItemMui
                          onClick={() => {
                            navigate(`/blog/edit/${post.id}`);
                            handleMenuClose();
                          }}
                        >
                           Edit
                        </MenuItemMui>
                        <MenuItemMui
                          onClick={() => {
                            handleDelete(post.id);
                          }}
                          sx={{ color: 'error.main' }}
                        >
                           Delete
                        </MenuItemMui>
                      </Menu>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={posts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Blog;