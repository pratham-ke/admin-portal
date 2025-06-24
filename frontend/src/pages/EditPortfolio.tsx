import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';

const getImageUrl = (image: string | undefined): string | null => {
    if (!image) return null;
    if (/^https?:\/\//.test(image) || /^blob:/.test(image)) return image;
    return `http://localhost:5000/uploads/portfolio/${image}`;
};

const EditPortfolio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const editor = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    category: '',
    year: new Date().getFullYear().toString(),
  });
  const [overview, setOverview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/portfolio/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, website, category, year, overview, image } = response.data;
        setFormData({ name, website, category, year: year.toString() });
        setOverview(overview);
        if (image) {
            setImagePreview(getImageUrl(image));
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch portfolio item data.');
        toast.error('Failed to fetch portfolio item data.');
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      if (imageFile) {
        data.append('image', imageFile);
      }

      await axios.put(`http://localhost:5000/api/portfolio/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Portfolio item updated successfully!');
      navigate('/portfolio');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating the portfolio item.';
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
          Edit Portfolio Item
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/portfolio')}
        >
          Back to Portfolio
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Card component={Paper} elevation={3}>
          <CardHeader title="Project Details" />
          <Divider />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar src={imagePreview || undefined} sx={{ width: 100, height: 100, mb: 2, borderRadius: '4px' }} variant="square" />
                  <Button variant="contained" component="label">
                    Change Project Image
                    <input type="file" hidden onChange={handleImageChange} accept="image/png, image/jpeg" />
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website URL"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Overview</Typography>
                <JoditEditor
                  ref={editor}
                  value={overview}
                  onBlur={(newContent: string) => setOverview(newContent)}
                />
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

export default EditPortfolio; 