// NotificationEmails.tsx
// Notification email management page for the admin portal.
// Allows administrators to manage notification email recipients for contact form notifications.
// Handles email validation, duplicate prevention, and save logic.

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, Chip } from '@mui/material';
import settingsService from '../../services/settingsService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const NotificationEmails: React.FC = () => {
  // --- State management ---
  // State for emails, input, errors, success, loading, etc.
  const [emails, setEmails] = useState<string[]>([]);
  // State to track the original list fetched from the server (for change detection)
  const [originalEmails, setOriginalEmails] = useState<string[]>([]);
  // State for the current input value in the add email field
  const [input, setInput] = useState('');
  // State for field-level error messages (shown under the input)
  const [inputError, setInputError] = useState('');
  // State for success messages (shown after successful add/save)
  const [success, setSuccess] = useState('');
  // State for loading indicator during save
  const [loading, setLoading] = useState(false);
  // React Router navigation
  const navigate = useNavigate();

  // --- Fetching emails ---
  // Fetches the current notification emails from the server on mount
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await settingsService.getNotificationEmails();
        setEmails(res.data.emails);
        setOriginalEmails(res.data.emails); // Save original for change detection
      } catch {
        setInputError('Failed to fetch emails');
      }
    };
    fetchEmails();
  }, []);

  // --- Email validation ---
  // Helper: Email validation using RFC 5322 standard
  // Returns an error message string if invalid, or undefined if valid
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required.';
    // RFC 5322 Official Standard regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    if (emails.some(e => e.toLowerCase() === email.toLowerCase())) return 'This email is already added.';
    return undefined;
  };

  // --- Input change/add/delete handlers ---
  // Helper: Check if the emails list has changed from the original
  const emailsChanged = () => {
    if (emails.length !== originalEmails.length) return true;
    const sortedA = [...emails].sort();
    const sortedB = [...originalEmails].sort();
    return !sortedA.every((val, idx) => val === sortedB[idx]);
  };

  // Handler: Add a new email to the list after validation
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

  // Handler: Update the input value and clear errors/success
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (inputError) setInputError('');
    setSuccess('');
  };

  // Handler: Remove an email from the list
  const handleDelete = (email: string) => {
    setEmails(emails.filter(e => e !== email));
    setSuccess('');
  };

  // --- Save handler ---
  // Handles saving the current list of emails to the server
  // Only allows save if there are changes and at least one email
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

  // --- Render ---
  // Renders the notification email management UI
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 'auto', mt: 2 }}>
      {/* Header with back button */}
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
        {/* Instructions */}
        <Typography sx={{ mb: 2 }}>Enter one or more email addresses to receive contact form notifications.</Typography>
        {/* Success message (shown after add/save) */}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {/* Email input and Add button */}
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
        {/* List of added emails as chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {emails.map(email => (
            <Chip key={email} label={email} onDelete={() => handleDelete(email)} />
          ))}
        </Box>
        {/* Save button is only enabled if there are changes and at least one email */}
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading || emails.length === 0 || !emailsChanged()}>
          Save
        </Button>
      </Paper>
    </Box>
  );
};

export default NotificationEmails; 