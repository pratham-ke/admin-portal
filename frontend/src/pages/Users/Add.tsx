// Add.tsx
// User creation page for the admin portal
//
// This component provides a form for administrators to add new users to the system.
// Features:
// - Input fields for user details
// - Form validation
// - Submission handling and feedback

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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import ImageUpload from '../../components/ImageUpload';
import apiClient from '../../services/apiClient';
import JSEncrypt from 'jsencrypt';

// --- Embedded User Service ---
const userService = {
  createUser: (userData: FormData) => apiClient.post('/users', userData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
// -------------------------

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  // --- State management ---
  // State for form fields, error messages, image upload, and password visibility
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- Fetching data ---
  // Fetch the public key for password encryption on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/auth/public-key')
      .then(res => res.text())
      .then(setPublicKey);
  }, []);

  // --- File upload handler ---
  // Handles image file selection and preview
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

  // --- Input change handler ---
  // Updates form field values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Password encryption ---
  // Encrypts the password using the public key
  const encryptPassword = (password: string) => {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(password) || '';
  };

  // --- Form submission ---
  // Validates input and submits the form to create a new user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation for required fields
    if (!formData.username || !formData.email || !formData.password) {
      setError('Username, Email, and Password are required.');
      toast.error('Username, Email, and Password are required.');
      return;
    }

    try {
      // Prepare form data for API
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      let passwordToSend = formData.password;
      if (publicKey) {
        const encrypted = encryptPassword(formData.password);
        if (encrypted) passwordToSend = encrypted;
      }
      data.append('password', passwordToSend);
      data.append('role', formData.role);
      if (imageFile) {
        data.append('image', imageFile);
      }

      // API call to create user
      await userService.createUser(data);
      toast.success('User added successfully!');
      navigate('/users');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while adding the user.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // --- Render ---
  // Renders the user creation form and feedback messages
  return (
    <Box sx={{ p: 3 }}>
      {/* Header and navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Add New User
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/users')}
          >
            Back to Users
          </Button>
          <Button type="submit" form="add-user-form" variant="contained" color="primary">
            Add User
          </Button>
        </Box>
      </Box>

      {/* User creation form */}
      <form id="add-user-form" onSubmit={handleSubmit}>
        <Card component={Paper} elevation={3}>
          <CardHeader title="User Details" />
          <Divider />
          <CardContent>
            {/* Error message */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3} alignItems="flex-start">
              {/* Profile image upload */}
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
                <ImageUpload
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  label="Upload Profile Picture"
                  avatarSize={180}
                />
              </Grid>
              {/* User details fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
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
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
};

export default AddUser; 