// SettingsPage.tsx
// Main settings page for the admin portal.
// Provides access to various settings sections and navigation.

import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

const SettingsPage: React.FC = () => {
  // --- Render ---
  // Renders the settings navigation and content
  const navigate = useNavigate();

  const options = [
    {
      label: 'Change Password',
      icon: <LockIcon color="primary" sx={{ fontSize: 40 }} />,
      path: '/settings/change-password',
    },
    {
      label: 'Notification Emails',
      icon: <EmailIcon color="primary" sx={{ fontSize: 40 }} />,
      path: '/settings/notification-emails',
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 0, pl: 0, ml: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pl: 0, ml: 0 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ ml: 0 }}>
          Settings
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {options.map(opt => (
          <Grid item xs={12} sm={6} key={opt.label}>
            <Card>
              <CardActionArea onClick={() => navigate(opt.path)}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                  {opt.icon}
                  <Typography variant="h6" sx={{ mt: 2 }}>{opt.label}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SettingsPage;