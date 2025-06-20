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

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
  content: string;
  status: 'draft' | 'published';
}

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Blog&background=random&size=48';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    description: '',
    image: '',
    category: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    content: '',
    status: 'draft',
  });
  const { token } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof BlogPost>('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blog', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleOpen = (post?: BlogPost) => {
    if (post) {
      setSelectedPost(post);
      let tags: string[] = [];
      if (Array.isArray(post.tags)) {
        tags = post.tags;
      } else if (typeof post.tags === 'string') {
        tags = (post.tags as string).split(',').map((tag: string) => tag.trim()).filter(Boolean);
      } else {
        tags = [];
      }
      setFormData({ ...post, tags });
      setImagePreview(post.image ? `/uploads/blog/${post.image}` : null);
      setImageFile(null);
    } else {
      setSelectedPost(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        category: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
        content: '',
        status: 'draft',
      });
      setImageFile(null);
      setImagePreview(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.title || !formData.description || !formData.category) {
      setFormError('Title, Description, and Category are required.');
      return;
    }
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags' && Array.isArray(value)) {
          data.append(key, value.join(','));
        } else if (value !== undefined && value !== null) {
          data.append(key, value as string);
        }
      });
      if (imageFile) {
        data.append('image', imageFile);
      }
      if (selectedPost) {
        await axios.put(
          `http://localhost:5000/api/blog/${selectedPost.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/blog', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleClose();
      fetchPosts();
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      setFormError('Error saving blog post. Please try again.');
      console.error('Error saving blog post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
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

  function getComparator<Key extends keyof any>(order: 'asc' | 'desc', orderBy: Key): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const sortedPosts = posts.slice().sort(getComparator(order, orderBy));
  const paginatedPosts = sortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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
            onClick={() => handleOpen()}
          >
            Add Blog Post
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
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
              <TableCell sortDirection={orderBy === 'author' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'author'}
                  direction={orderBy === 'author' ? order : 'asc'}
                  onClick={() => handleRequestSort('author')}
                >
                  Author
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'date' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleRequestSort('date')}
                >
                  Date
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
            {paginatedPosts.map((post: BlogPost, idx: number) => (
              <TableRow key={post.id}>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>
                  {post.image && (
                    <img
                      src={/^https?:\/\//.test(post.image) ? post.image : `http://localhost:5000/uploads/blog/${post.image}`}
                      alt={post.title}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE; }}
                    />
                  )}
                </TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                <TableCell>{post.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(post)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(post.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={posts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPost ? 'Edit Blog Post' : 'Add Blog Post'}
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
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
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
              label="Author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
                })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              margin="normal"
              multiline
              rows={6}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'draft' | 'published',
                  })
                }
                label="Status"
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ my: 2 }}>
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" accept="image/png, image/jpeg" hidden onChange={handleImageChange} />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 1 }}>
                  <img src={imagePreview} alt="Preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedPost ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Blog; 