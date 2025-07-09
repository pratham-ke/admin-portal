import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, Chip } from '@mui/material';
import settingsService from '../../services/settingsService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const NotificationEmails: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [originalEmails, setOriginalEmails] = useState<string[]>([]); // Track original
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await settingsService.getNotificationEmails();
        setEmails(res.data.emails);
        setOriginalEmails(res.data.emails); // Save original
      } catch {
        setInputError('Failed to fetch emails');
      }
    };
    fetchEmails();
  }, []);

  // Email validation function (strong, like Google/Amazon)
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required.';
    // RFC 5322 Official Standard regex (used by Google)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    if (emails.some(e => e.toLowerCase() === email.toLowerCase())) return 'This email is already added.';
    return undefined;
  };

  const handleAdd = () => {
    const email = input.trim();
    const validationError = validateEmail(email);
    if (validationError) {
      setInputError(validationError);
      setSuccess('');
      return;
    }
    setEmails([...emails, email]);
    setInput('');
    setInputError('');
    setSuccess('Email added successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (inputError) setInputError('');
    setSuccess('');
  };

  const handleDelete = (email: string) => {
    setEmails(emails.filter(e => e !== email));
    setSuccess('');
  };

  // Helper to check if emails have changed
  const emailsChanged = () => {
    if (emails.length !== originalEmails.length) return true;
    const sortedA = [...emails].sort();
    const sortedB = [...originalEmails].sort();
    return !sortedA.every((val, idx) => val === sortedB[idx]);
  };

  const handleSave = async () => {
    if (input.trim()) {
      setInputError('Please add or clear the email field before saving.');
      setSuccess('');
      return;
    }
    if (emails.length === 0) {
      setSuccess('');
      setInputError('Please add at least one email before saving.');
      return;
    }
    if (!emailsChanged()) {
      setSuccess('');
      setInputError('No changes to save.');
      return;
    }
    setLoading(true);
    setInputError('');
    setSuccess('');
    try {
      await settingsService.saveNotificationEmails(emails);
      setSuccess('Notification emails updated');
      setOriginalEmails(emails); // Update original after save
    } catch (err: any) {
      setInputError(err?.response?.data?.message || 'Failed to save emails');
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
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Add Email"
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            size="small"
            fullWidth
            error={!!inputError}
            helperText={inputError}
          />
          <Button variant="contained" onClick={handleAdd} disabled={!input.trim()}>Add</Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {emails.map(email => (
            <Chip key={email} label={email} onDelete={() => handleDelete(email)} />
          ))}
        </Box>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading || emails.length === 0 || !emailsChanged()}>Save</Button>
      </Paper>
    </Box>
  );
};

export default NotificationEmails; 