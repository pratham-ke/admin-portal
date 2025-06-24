import React, { useState } from 'react';
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
import ImageUpload from '../components/ImageUpload';
import apiClient from '../services/apiClient';
import JoditEditor from 'jodit-react';

// --- Embedded Team Service ---
const teamService = {
  createMember: (data: FormData) => apiClient.post('/team', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
// -------------------------

const AddTeam: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const editor = React.useRef(null);
  const [bio, setBio] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
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

    if (!formData.name || !formData.email || !formData.position) {
      setError('Name, Email, and Position are required.');
      toast.error('Name, Email, and Position are required.');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('position', formData.position);
      data.append('bio', bio);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await teamService.createMember(data);
      toast.success('Team member added successfully!');
      navigate('/team');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while adding the team member.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Add New Team Member
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/team')}
        >
          Back to Team
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Card component={Paper} elevation={3}>
          <CardHeader title="Team Member Details" />
          <Divider />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ImageUpload
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  label="Upload Picture"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
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
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Biography</Typography>
                <JoditEditor
                  ref={editor}
                  value={bio}
                  onBlur={newContent => setBio(newContent)}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Add Member
            </Button>
          </Box>
        </Card>
      </form>
    </Box>
  );
};

export default AddTeam; 