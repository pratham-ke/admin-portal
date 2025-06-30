import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

const SettingsPage: React.FC = () => {
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
    <Layout>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Settings
          </Typography>
        </Box>
        <Grid container spacing={3}>
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
    </Layout>
  );
};

export default SettingsPage; 