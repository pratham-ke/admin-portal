// ChangePasswordPage.tsx
// Change password page for the admin portal.
// Allows users to change their password with strong validation and feedback.
// Handles form validation, password encryption, and submission.

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import settingsService from '../../services/settingsService';
import JSEncrypt from 'jsencrypt';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePasswordPage: React.FC = () => {
  // --- State management ---
  // State for password fields, error messages, loading, etc.
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const navigate = useNavigate();

  // --- Fetching public key ---
  // Fetches the public key for password encryption on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/auth/public-key')
      .then(res => res.text())
      .then(setPublicKey);
  }, []);

  // --- Password encryption ---
  // Encrypts the password using the public key
  const encryptPassword = (password: string) => {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(password) || '';
  };

  // --- Validation functions ---
  // Validates the current password field.
  const validateCurrentPassword = (value: string): string | undefined => {
    if (!value) return 'Current password is required.';
    return undefined;
  };
  // Validates the new password field.
  const validateNewPassword = (value: string): string | undefined => {
    if (!value) return 'New password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*]/.test(value)) return 'Password must contain at least one special character (!@#$%^&*).';
    return undefined;
  };
  // Validates the confirm password field.
  const validateConfirmPassword = (value: string): string | undefined => {
    if (!value) return 'Please confirm your new password.';
    if (value !== newPassword) return 'Passwords do not match.';
    return undefined;
  };
  // Validates the entire form.
  const validateForm = (): boolean => {
    const newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};
    newErrors.currentPassword = validateCurrentPassword(currentPassword);
    newErrors.newPassword = validateNewPassword(newPassword);
    newErrors.confirmPassword = validateConfirmPassword(confirmPassword);
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };
  // Handles input changes for password fields.
  const handleInputChange = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (field === 'currentPassword') setCurrentPassword(value);
    if (field === 'newPassword') setNewPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // --- Form submission ---
  // Handles the form submission to change the password.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      let currentToSend = currentPassword;
      let newToSend = newPassword;
      if (publicKey) {
        const encCurrent = encryptPassword(currentPassword);
        const encNew = encryptPassword(newPassword);
        if (encCurrent) currentToSend = encCurrent;
        if (encNew) newToSend = encNew;
      }
      await settingsService.changePassword(currentToSend, newToSend);
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (err: any) {
      // Map backend errors to field-level errors
      const backendMessage = err.response?.data?.message || '';
      const backendErrors = err.response?.data?.errors || [];
      let newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};
      if (backendMessage.toLowerCase().includes('current')) {
        newErrors.currentPassword = backendMessage;
      } else if (backendMessage.toLowerCase().includes('new password')) {
        newErrors.newPassword = backendMessage;
      } else if (backendMessage.toLowerCase().includes('confirm')) {
        newErrors.confirmPassword = backendMessage;
      }
      backendErrors.forEach((msg: string) => {
        if (msg.toLowerCase().includes('current')) newErrors.currentPassword = msg;
        if (msg.toLowerCase().includes('new password')) newErrors.newPassword = msg;
        if (msg.toLowerCase().includes('confirm')) newErrors.confirmPassword = msg;
      });
      // Fallback: if no field error, show as newPassword error
      if (!newErrors.currentPassword && !newErrors.newPassword && !newErrors.confirmPassword && backendMessage) {
        newErrors.newPassword = backendMessage;
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  // Renders the change password form and feedback messages.
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 'auto', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Change Password</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
        Back
      </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            fullWidth
            value={currentPassword}
            onChange={handleInputChange('currentPassword')}
            sx={{ mb: 2 }}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowCurrent((s) => !s)} edge="end">
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            type={showNew ? 'text' : 'password'}
            fullWidth
            value={newPassword}
            onChange={handleInputChange('newPassword')}
            sx={{ mb: 2 }}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew((s) => !s)} edge="end">
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            type={showConfirm ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            sx={{ mb: 3 }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ fontWeight: 600, fontSize: 16, background: '#488010', '&:hover': { background: '#36610c' } }}>
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePasswordPage; 