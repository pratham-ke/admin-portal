// ForgotPassword.tsx
// Forgot password page for the admin portal.
// Allows users to request a password reset email.
// Handles form validation, API call, and feedback.

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  CircularProgress,
  GlobalStyles,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import '@fontsource/poppins';

interface ForgotPasswordFormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

const ForgotPassword: React.FC = () => {
  // --- State management ---
  // State for email field, errors, loading, etc.
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  // --- Validation function ---
  // ... validation logic ...
  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please provide a valid email address';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.email = validateEmail(formData.email);
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  // --- Input change handler ---
  // ... handler logic ...
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    
    // Clear general error when user makes changes
    if (generalError) {
      setGeneralError('');
    }
  };

  // --- Form submission ---
  // Handles the form submission to request a password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      await forgotPassword(formData.email);
      setSuccessMessage('Password reset link has been sent to your email.');
      setFormData({ email: '' });
    } catch (err: any) {
      let errorMessage = 'Something went wrong. Please try again later.';
      const backendMsg = err.response?.data?.message || '';
      const backendErrors = err.response?.data?.errors || [];
      if (backendMsg.toLowerCase().includes('valid user')) {
        errorMessage = 'Please enter valid user.';
        setErrors({ email: errorMessage });
      } else if (backendMsg.toLowerCase().includes('valid email address')) {
        errorMessage = 'Please enter a valid email address.';
        setErrors({ email: errorMessage });
      } else if (backendMsg.toLowerCase().includes('email is required')) {
        errorMessage = 'Email is required.';
        setErrors({ email: errorMessage });
      } else if (backendMsg.toLowerCase().includes('validation error') && backendErrors.length > 0) {
        // Map Joi validation errors to field error
        const firstError = backendErrors[0];
        if (firstError.toLowerCase().includes('valid email address')) {
          setErrors({ email: 'Please enter a valid email address.' });
        } else if (firstError.toLowerCase().includes('email is required')) {
          setErrors({ email: 'Email is required.' });
        } else {
          setGeneralError(errorMessage);
        }
      } else {
      setGeneralError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // --- Render ---
  // Renders the forgot password form and feedback messages
  return (
    <>
      <GlobalStyles styles={{
        html: { minHeight: '100%', background: '#F3F7FD', fontFamily: 'Poppins, sans-serif', overflowX: 'hidden', width: '100vw' },
        body: { minHeight: '100%', background: '#F3F7FD', fontFamily: 'Poppins, sans-serif', overflowX: 'hidden', width: '100vw' },
        '#root': { minHeight: '100%' },
      }} />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          maxHeight: '100vh',
          maxWidth: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          inset: 0,
          background: 'url(/group-bg.png) center center / cover no-repeat',
          overflow: 'hidden',
          m: 0,
          p: 0,
          border: 'none',
        }}
      >
        {/* Left decorative image */}
        <Box
          component="img"
          src="/login-left.png"
          alt="login left design"
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '90%',
            maxHeight: '100vh',
            width: 'auto',
            zIndex: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        {/* Right decorative image */}
        <Box
          component="img"
          src="/login-right.png"
          alt="login right design"
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '35%',
            maxHeight: '100vh',
            width: 'auto',
            zIndex: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        <Container component="main" maxWidth={false} sx={{ zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 0 }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 480,
              bgcolor: '#fff',
              borderRadius: '16px',
              boxShadow: '0px 12px 40px 0px rgba(167, 221, 157, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 4, sm: 6, md: 8 },
              m: 0,
              border: 'none',
          }}
        >
            <img src="/kernel-logo.png" alt="Kernelequity Logo" style={{ width: 180, maxWidth: '60vw', marginBottom: 8, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#454545', mt: 1, mb: 2, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 18, sm: 20, md: 22 }, width: '100%' }}>
            Forgot Password
              <Box sx={{ width: 60, height: 4, bgcolor: '#488010', borderRadius: 2, mx: 'auto', mt: 1 }} />
          </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {generalError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {generalError}
            </Alert>
          )}
              <Typography sx={{ color: errors.email ? '#d32f2f' : '#777', fontWeight: 400, fontSize: { xs: 14, sm: 16 }, mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Email</Typography>
            <TextField
              fullWidth
                placeholder="Enter your email"
                variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
                sx={{
                  mb: 2,
                  bgcolor: '#fff',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#DFDFDF' },
                    '&:hover fieldset': { borderColor: '#488010' },
                    '&.Mui-focused fieldset': { borderColor: '#488010' },
                    '&.Mui-error fieldset': { borderColor: '#d32f2f' },
                  },
                  '& input': { color: errors.email ? '#d32f2f' : '#777', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 14, sm: 16 } },
                  '& .MuiFormHelperText-root': { color: '#d32f2f', fontWeight: 500 },
                }}
                InputProps={{ style: { color: '#777' } }}
              />
            <Button
              type="submit"
              fullWidth
              variant="contained"
                sx={{
                  mt: 1,
                  height: 48,
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: { xs: 15, sm: 16 },
                  background: '#488010',
                  color: '#fff',
                  boxShadow: '0px 8px 7.5px -1px rgba(0,0,0,0.09)',
                  textTransform: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  '&:hover': { background: '#36610c' },
                }}
              disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
            </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#777', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 12, sm: 14 } }}>
                Remember your password?{' '}
                  <Link component={RouterLink} to="/login" variant="body2" sx={{ color: '#488010', fontWeight: 500, fontFamily: 'Poppins, sans-serif', textDecoration: 'none', fontSize: { xs: 12, sm: 14 } }}>
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPassword; 