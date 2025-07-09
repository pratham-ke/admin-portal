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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import ImageUpload from '../../components/ImageUpload';
import apiClient from '../../services/apiClient';

// --- Embedded Portfolio Service ---
const portfolioService = {
  addItem: (data: FormData) => apiClient.post('/v1/portfolio', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
// --------------------------------

const AddPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const editor = useRef(null);
  const [overview, setOverview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    category: '',
    year: new Date().getFullYear().toString(),
  });
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState('Active');

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

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value as string);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.category) {
      setError('Project Name and Category are required.');
      toast.error('Project Name and Category are required.');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('website', formData.website);
      data.append('category', formData.category);
      data.append('year', formData.year);
      data.append('overview', overview);
      data.append('status', status);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await portfolioService.addItem(data);
      toast.success('Portfolio item added successfully!');
      navigate('/portfolio');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while adding the portfolio item.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Add New Portfolio Item
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/portfolio')}
          >
            Back to Portfolio
          </Button>
          <Button type="submit" form="add-portfolio-form" variant="contained" color="primary">
            Add Item
          </Button>
        </Box>
      </Box>

      <form id="add-portfolio-form" onSubmit={handleSubmit}>
        <Card component={Paper} elevation={3}>
          <CardHeader title="Project Details" />
          <Divider />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: 500 }}>
                <ImageUpload
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  label="Upload Project Image"
                  avatarSize={180}
                  square
                />
                <TextField
                  fullWidth
                  label="Project Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ mt: 3 }}
                />
                <TextField
                  fullWidth
                  label="Website URL"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
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
                <TextField
                  fullWidth
                  label="Year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  sx={{ mt: 3 }}
                />
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="status-label">Project Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={status}
                    label="Project Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Exit">Exit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8} sx={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Overview</Typography>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <JoditEditor
                    ref={editor}
                    value={overview}
                    onBlur={(newContent: string) => setOverview(newContent)}
                    config={{ height: 400 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        </Card>
      </form>
    </Box>
  );
};

export default AddPortfolio; 