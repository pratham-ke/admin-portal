import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, Chip } from '@mui/material';
import settingsService from '../../services/settingsService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const NotificationEmails: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await settingsService.getNotificationEmails();
        setEmails(res.data.emails);
      } catch {
        setError('Failed to fetch emails');
      }
    };
    fetchEmails();
  }, []);

  const handleAdd = () => {
    const email = input.trim();
    if (!email) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Invalid email');
      return;
    }
    if (emails.includes(email)) {
      setError('Email already added');
      return;
    }
    setEmails([...emails, email]);
    setInput('');
    setError('');
  };

  const handleDelete = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await settingsService.saveNotificationEmails(emails);
      setSuccess('Notification emails updated');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save emails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 'auto', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Notification Emails</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
        Back
      </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography sx={{ mb: 2 }}>Enter one or more email addresses to receive contact form notifications.</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Add Email"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            size="small"
            fullWidth
          />
          <Button variant="contained" onClick={handleAdd} disabled={!input.trim()}>Add</Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {emails.map(email => (
            <Chip key={email} label={email} onDelete={() => handleDelete(email)} />
          ))}
        </Box>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading || emails.length === 0}>Save</Button>
      </Paper>
    </Box>
  );
};

export default NotificationEmails; 