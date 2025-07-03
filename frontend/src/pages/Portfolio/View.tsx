import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Avatar, Card, CardHeader, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

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
        const response = await axios.get(`http://localhost:5000/api/v1/portfolio/${id}`, {
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
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3, maxWidth: 1100, mx: 'auto' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined">
          Back
        </Button>
      </Box>
      <Card component={Paper} elevation={3} sx={{ width: '100%', maxWidth: 1100, mx: 'auto', borderRadius: 3 }}>
        <CardHeader
          avatar={
            <Box sx={{ width: 120, height: 120, mr: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent', borderRadius: 8 }}
              />
            </Box>
          }
          title={<Typography variant="h5" fontWeight={600}>{item.name}</Typography>}
          subheader={
            <Box>
              <Typography variant="subtitle1" color="text.secondary">{item.category}</Typography>
              <Typography variant="body2" color="text.secondary">Year: {item.year}</Typography>
              <Typography variant="body2" color="text.secondary">Status: {item.status}</Typography>
            </Box>
          }
          sx={{ pb: 0, alignItems: 'flex-start', mb: 2 }}
        />
        <Divider sx={{ mb: 3 }} />
        <CardContent>
          {item.overview && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={500}>Overview</Typography>
              <Box sx={{ color: 'text.secondary' }} dangerouslySetInnerHTML={{ __html: item.overview }} />
            </Box>
          )}
          {item.website && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Website: <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a></Typography>
          )}
        </CardContent>
        <Divider />
      </Card>
    </Box>
  );
};

export default PortfolioView; 