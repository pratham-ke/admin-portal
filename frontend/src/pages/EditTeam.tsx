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
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import apiClient from '../services/apiClient';
import JoditEditor from 'jodit-react';

// --- Embedded Team Service ---
const teamService = {
  getMember: (id: string) => apiClient.get(`/team/${id}`),
  updateMember: (id: string, data: FormData) => apiClient.put(`/team/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
// -------------------------

const getImageUrl = (image: string | undefined): string | null => {
    if (!image) return null;
    if (/^https?:\/\//.test(image) || /^blob:/.test(image)) return image;
    return `http://localhost:5000/uploads/team/${image}`;
};

const EditTeam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const editor = React.useRef(null);
  const [bio, setBio] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const response = await teamService.getMember(id!);
        const { name, email, position, bio, image } = response.data;
        setFormData({ name, email, position });
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

      await teamService.updateMember(id!, data);
      toast.success('Team member updated successfully!');
      navigate('/team');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating the team member.';
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
          Edit Team Member
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
                  required
                  sx={{ mt: 3 }}
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

export default EditTeam; 