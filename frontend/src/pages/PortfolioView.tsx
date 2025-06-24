import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Portfolio&background=random&size=80';

const getImageUrl = (image: string | undefined) => {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//.test(image)) return image;
  return `http://localhost:5000/uploads/portfolio/${image}`;
};

const PortfolioView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/portfolio/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(response.data);
      } catch (err) {
        setError('Failed to fetch project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, token]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><Typography color="error">{error}</Typography></Box>;
  if (!item) return null;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }} variant="outlined">
          Back
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Avatar
            src={getImageUrl(item.image)}
            alt={item.name}
            sx={{ width: 80, height: 80, fontSize: 32 }}
          >
            {item.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>{item.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{item.category}</Typography>
            <Typography variant="body2" color="text.secondary">Year: {item.year}</Typography>
            <Typography variant="body2" color="text.secondary">Status: {item.status}</Typography>
          </Box>
        </Box>
        {item.overview && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={500}>Overview</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{item.overview}</Typography>
          </Box>
        )}
        {item.website && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Website: <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a></Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PortfolioView; 