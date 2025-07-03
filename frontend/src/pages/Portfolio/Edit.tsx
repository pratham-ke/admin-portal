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
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import ImageUpload from '../../components/ImageUpload';
import apiClient from '../../services/apiClient';

// --- Embedded Portfolio Service ---
const portfolioService = {
  getItem: (id: string) => apiClient.get(`/v1/portfolio/${id}`),
  updateItem: (id: string, data: FormData) => apiClient.put(`/v1/portfolio/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
// --------------------------------

const getImageUrl = (image: string | undefined): string | null => {
    if (!image) return null;
    if (/^https?:\/\//.test(image) || /^blob:/.test(image)) return image;
    return `http://localhost:5000/uploads/portfolio/${image}`;
};

const EditPortfolio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      if (!id) return;
      try {
        setLoading(true);
        const response = await portfolioService.getItem(id);
        const { name, website, category, year, overview, image } = response.data;
        setFormData({ name, website, category, year: year.toString() });
        setOverview(overview);
        if (image) {
            setImagePreview(getImageUrl(image));
        }
      } catch (err) {
        setError('Failed to fetch portfolio item data.');
        toast.error('Failed to fetch portfolio item data.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

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

    if (!formData.name || !formData.category) {
      setError('Project Name and Category are required.');
      toast.error('Project Name and Category are required.');
      return;
    }

    if (!id) {
      setError('Portfolio item ID is missing.');
      toast.error('Portfolio item ID is missing.');
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
      
      await portfolioService.updateItem(id, data);
      
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/portfolio')}
          >
            Back to Portfolio
          </Button>
          <Button type="submit" form="edit-portfolio-form" variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Box>

      <form id="edit-portfolio-form" onSubmit={handleSubmit}>
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
                  label="Change Project Image"
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

export default EditPortfolio; 