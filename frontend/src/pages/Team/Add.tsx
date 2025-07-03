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
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import ImageUpload from '../../components/ImageUpload';
import apiClient from '../../services/apiClient';
import JoditEditor from 'jodit-react';

// --- Embedded Team Service ---
const teamService = {
  createMember: (data: FormData) => apiClient.post('/v1/team', data, {
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
    linkedin: '',
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

    if (!formData.name || !formData.position) {
      setError('Name and Position are required.');
      toast.error('Name and Position are required.');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('position', formData.position);
      data.append('bio', bio);
      data.append('linkedin', formData.linkedin);
      
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/team')}
          >
            Back to Team
          </Button>
          <Button type="submit" form="add-team-form" variant="contained" color="primary">
            Add Member
          </Button>
        </Box>
      </Box>

      <form id="add-team-form" onSubmit={handleSubmit}>
        <Card component={Paper} elevation={3}>
          <CardHeader title="Team Member Details" />
          <Divider />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3} alignItems="stretch" sx={{ minHeight: 400, height: '100%' }}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: 400, height: '100%' }}>
                <ImageUpload
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  label="Upload Picture"
                  avatarSize={180}
                />
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ mt: 3 }}
                />
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  sx={{ mt: 3 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ mt: 3 }}
                />
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  sx={{ mt: 3 }}
                  placeholder="https://linkedin.com/in/username"
                />
              </Grid>
              <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Biography</Typography>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <JoditEditor
                    ref={editor}
                    value={bio}
                    onBlur={newContent => setBio(newContent)}
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

export default AddTeam; 