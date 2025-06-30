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
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import ConfirmDialog from '../../components/ConfirmDialog';

// --- Embedded Blog Service ---
const blogService = {
  getPosts: () => apiClient.get('/v1/blogs?admin=true'),
  deletePost: (id: string) => apiClient.delete(`/v1/blogs/${id}`),
  togglePostStatus: (id: string) => apiClient.patch(`/v1/blogs/${id}/toggle-status`),
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

const BLOG_ROWS_PER_PAGE_KEY = 'blogRowsPerPage';
const BLOG_PAGE_KEY = 'blogPage';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { token } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof BlogPost>('title');
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem(BLOG_ROWS_PER_PAGE_KEY);
    return saved ? parseInt(saved, 10) : 10;
  });
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem(BLOG_PAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

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

  const handleDeleteClick = (id: number) => {
    setDeletePostId(id);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (deletePostId !== null) {
      try {
        await blogService.deletePost(String(deletePostId));
        fetchPosts();
      } catch (error) {
        setError('Failed to delete blog post.');
      }
    }
    setDeleteDialogOpen(false);
    setDeletePostId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletePostId(null);
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
    localStorage.setItem(BLOG_PAGE_KEY, newPage.toString());
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
    localStorage.setItem(BLOG_ROWS_PER_PAGE_KEY, value.toString());
    localStorage.setItem(BLOG_PAGE_KEY, '0');
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

  type Order = 'asc' | 'desc';

  function getComparator<Key extends keyof BlogPost>(order: Order, orderBy: Key): (a: BlogPost, b: BlogPost) => number {
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
                <TableCell>Image</TableCell>
                <TableCell sortDirection={orderBy === 'title' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleRequestSort('title')}
                  >
                    Title
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
              {paginatedPosts.map((post, index) => (
                <TableRow key={post.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <img src={getImageUrl(post.image)} alt={post.title} style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }} />
                  </TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
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
                          sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}
                        >
                          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                        </MenuItemMui>
                        <MenuItemMui
                          onClick={() => handleDeleteClick(post.id)}
                          sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}
                        >
                          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
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
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={posts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmButtonText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default Blog; 