import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=Blog&background=random&size=80';

const getImageUrl = (image: string | undefined) => {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//.test(image)) return image;
  return `http://localhost:5000/uploads/blog/${image}`;
};

const BlogView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch blog post details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><Typography color="error">{error}</Typography></Box>;
  if (!post) return null;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }} variant="outlined">
          Back
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Avatar
            src={getImageUrl(post.image)}
            alt={post.title}
            sx={{ width: 80, height: 80, fontSize: 32 }}
          >
            {post.title?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>{post.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{post.category}</Typography>
            <Typography variant="body2" color="text.secondary">{new Date(post.date).toLocaleDateString()}</Typography>
            <Typography variant="body2" color="text.secondary">Status: {post.status}</Typography>
          </Box>
        </Box>
        {post.content && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={500}>Content</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{post.content}</Typography>
          </Box>
        )}
        {post.author && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Author: {post.author}</Typography>
        )}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={500}>Tags</Typography>
            <Typography variant="body2">{Array.isArray(post.tags) ? post.tags.join(', ') : post.tags}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BlogView; 