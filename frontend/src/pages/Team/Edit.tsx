// Edit.tsx
// Team member editing page for the admin portal.
// Allows editing of existing team member details and image.
// Handles data fetching, form validation, submission, and feedback.

import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import ImageUpload from '../../components/ImageUpload';
import apiClient from '../../services/apiClient';
import JoditEditor from 'jodit-react';

// --- Embedded Team Service ---
// Handles API calls for team member data and updates.
const teamService = {
  getMember: (id: string) => apiClient.get(`/v1/team/${id}`),
  updateMember: (id: string, data: FormData) => apiClient.put(`/v1/team/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
// -------------------------

const getImageUrl = (image: string | undefined): string | null => {
    if (!image) return null;
    if (/^https?:\/\//.test(image) || /^blob:/.test(image)) return image;
    return `http://localhost:5000/uploads/team/${image}`;
};

const EditTeamMember: React.FC = () => {
  // --- State management ---
  // State for form fields, error messages, image upload, etc.
  const { id } = useParams<{ id: string }>();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- Data fetching ---
  // Fetches the team member data to populate the form
  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const response = await teamService.getMember(id!);
        const { name, email, position, bio, image, linkedin } = response.data;
        setFormData({ 
          name: name ?? '',
          email: email ?? '',
          position: position ?? '',
          linkedin: linkedin ?? '',
        });
        setBio(bio || '');
        if (image) {
            setImagePreview(getImageUrl(image));
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch team member data.');
        toast.error('Failed to fetch team member data.');
        setLoading(false);
      }
    };
    fetchMember();
  }, [id, token]);

  // --- Input/file change handlers ---
  // Handles file selection for image upload.
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

  // Handles form field changes.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Form submission ---
  // Handles the form submission for updating team member data.
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
      if (formData.linkedin) {
        data.append('linkedin', formData.linkedin);
      }

      if (imageFile) {
        data.append('image', imageFile);
      }

      await teamService.updateMember(id!, data);
      toast.success('Team member updated successfully!');
      navigate('/team');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating the team member.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // --- Render ---
  // Renders the team member editing form and feedback messages
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
          Edit Team Member
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/team')}
          >
            Back to Team
          </Button>
          <Button type="submit" form="edit-team-form" variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Box>

      <form id="edit-team-form" onSubmit={handleSubmit}>
        <Card component={Paper} elevation={3}>
          <CardHeader title="Team Member Details" />
          <Divider />
          <CardContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: 500 }}>
                <ImageUpload
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  label="Change Picture"
                  avatarSize={180}
                />
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  sx={{ mt: 3 }}
                />
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  required
                  sx={{ mt: 3 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
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
              <Grid item xs={12} md={8} sx={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
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

export default EditTeamMember; 