// View.tsx
// Team member detail page for the admin portal.
// Displays detailed information about a single team member.
// Fetches team member data from the API and presents it in a readable format.

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Avatar, Card, CardHeader, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Team&background=random&size=80';

const getImageUrl = (image: string | undefined) => {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//.test(image)) return image;
  return `http://localhost:5000/uploads/team/${image}`;
};

const TeamMemberView: React.FC = () => {
  // --- State management ---
  // State for team member data, loading, error, etc.
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Data fetching ---
  // Fetches the team member data from the API
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/team/${id}`, {
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

  // --- Render ---
  // Renders the team member details
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><Typography color="error">{error}</Typography></Box>;
  if (!member) return null;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%', overflowX: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3, maxWidth: 1100, mx: 'auto' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined">
          Back
        </Button>
      </Box>
      <Card component={Paper} elevation={3} sx={{ width: '100%', maxWidth: 1100, mx: 'auto', borderRadius: 3, overflowX: 'hidden' }}>
        <CardHeader
          avatar={
            <Box sx={{ width: 120, height: 120, mr: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <img
                src={getImageUrl(member.image)}
                alt={member.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent', borderRadius: 8 }}
              />
            </Box>
          }
          title={<Typography variant="h5" fontWeight={600}>{member.name}</Typography>}
          subheader={
            <Box>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>{member.position}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{member.email}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Status: {member.status}</Typography>
              {member.linkedin && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LinkedInIcon color="primary" sx={{ mr: 1 }} />
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0a66c2', textDecoration: 'none', fontWeight: 500 }}>
                    {member.linkedin}
                  </a>
                </Box>
              )}
            </Box>
          }
          sx={{ pb: 0, alignItems: 'flex-start', mb: 2 }}
        />
        <Divider sx={{ mb: 3 }} />
        <CardContent>
          {member.bio && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={500}>Bio</Typography>
              <Box sx={{ color: 'text.secondary' }} dangerouslySetInnerHTML={{ __html: member.bio }} />
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
        </CardContent>
        <Divider />
      </Card>
    </Box>
  );
};

export default TeamMemberView;
export {}; 