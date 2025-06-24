import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Team&background=random&size=80';

const getImageUrl = (image: string | undefined) => {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//.test(image)) return image;
  return `http://localhost:5000/uploads/team/${image}`;
};

const TeamView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/team/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMember(response.data);
      } catch (err) {
        setError('Failed to fetch team member details.');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id, token]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><Typography color="error">{error}</Typography></Box>;
  if (!member) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }} variant="outlined">
          Back
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Avatar
            src={getImageUrl(member.image)}
            alt={member.name}
            sx={{ width: 80, height: 80, fontSize: 32 }}
          >
            {member.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>{member.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{member.position}</Typography>
            <Typography variant="body2" color="text.secondary">{member.email}</Typography>
            <Typography variant="body2" color="text.secondary">Status: {member.status}</Typography>
          </Box>
        </Box>
        {member.bio && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={500}>Bio</Typography>
            <Typography variant="body1" color="text.secondary">{member.bio}</Typography>
          </Box>
        )}
        {member.social_links && Object.keys(member.social_links).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={500}>Social Links</Typography>
            {Object.entries(member.social_links).map(([platform, url]) => (
              <Typography key={platform} variant="body2">
                {platform}: <a href={url as string} target="_blank" rel="noopener noreferrer">{url as string}</a>
              </Typography>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TeamView; 