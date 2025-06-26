import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Avatar,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import ImageUpload from '../components/ImageUpload';
import apiClient from '../services/apiClient';

// --- Embedded Blog Service ---
const blogService = {
  addPost: (data: FormData) => apiClient.post('/v1/blogs', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
// --------------------------

const AddBlog: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.category || !content) {
      setError('Title, Category, and Content are required.');
      toast.error('Title, Category, and Content are required.');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('content', content);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await blogService.addPost(data);
      toast.success('Blog post added successfully!');
      navigate('/blog');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while adding the blog post.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Add New Blog Post
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blog')}
        >
          Back to Blog
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Card component={Paper} elevation={3}>
          <CardHeader title="Blog Post Details" />
          <Divider />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: 500 }}>
                <ImageUpload
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  label="Upload Featured Image"
                  avatarSize={180}
                  square
                />
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  sx={{ mt: 3 }}
                />
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  sx={{ mt: 3 }}
                />
              </Grid>
              <Grid item xs={12} md={8} sx={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Content</Typography>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <JoditEditor
                    ref={editor}
                    value={content}
                    onBlur={(newContent: string) => setContent(newContent)}
                    config={{ height: 400 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Add Post
            </Button>
          </Box>
        </Card>
      </form>
    </Box>
  );
};

export default AddBlog; 