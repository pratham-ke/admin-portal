// ErrorPage.tsx
// Error page for the admin portal.
// Displays a user-friendly error message for unexpected errors or 404s.

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ErrorPage: React.FC = () => {
  // --- Render ---
  // Renders the error message UI
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button href="/" variant="contained" color="primary">
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default ErrorPage;
export {}; 