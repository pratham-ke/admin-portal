import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import apiClient from '../services/apiClient';

// --- Embedded User Service ---
const userService = {
  getUser: (id: string) => apiClient.get(`/users/${id}`),
  updateUser: (id: string, userData: FormData) => apiClient.put(`/users/${id}`, userData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
// -------------------------

const getImageUrl = (image: string | undefined): string | null => {
    if (!image) return null;
    if (/^https?:\/\//.test(image) || /^blob:/.test(image)) return image;
    return `http://localhost:5000/uploads/user/${image}`;
};

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userService.getUser(id!);
        const { username, email, role, image } = response.data;
        setFormData({ username, email, role });
        if (image) {
            setImagePreview(getImageUrl(image));
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data.');
        toast.error('Failed to fetch user data.');
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

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

    if (!formData.username || !formData.email) {
      setError('Username and Email are required.');
      toast.error('Username and Email are required.');
      return;
    }

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('role', formData.role);
      if (imageFile) {
        data.append('image', imageFile);
      }

      await userService.updateUser(id!, data);
      toast.success('User updated successfully!');
      navigate('/users');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating the user.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Edit User
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
        >
          Back to Users
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Card component={Paper} elevation={3}>
          <CardHeader title="User Details" />
          <Divider />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ImageUpload
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  label="Change Profile Picture"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Card>
      </form>
    </Box>
  );
};

export default EditUser; 