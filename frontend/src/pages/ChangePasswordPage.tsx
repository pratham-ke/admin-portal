import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    // TODO: Implement API call for password change
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 'auto', mt: 2 }}>
        <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h4" gutterBottom>Change Password</Typography>
        <Paper sx={{ p: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ChangePasswordPage; 