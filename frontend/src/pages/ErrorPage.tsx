import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Typography variant="h2" color="primary" gutterBottom>404</Typography>
      <Typography variant="h5" gutterBottom>Page Not Found</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>Sorry, the page you are looking for does not exist or an error occurred.</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>Go to Dashboard</Button>
    </Box>
  );
};

export default ErrorPage; 