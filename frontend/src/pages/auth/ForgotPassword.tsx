import React, { useState } from 'react';
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

interface ForgotPasswordFormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      await forgotPassword(formData.email);
      setSuccessMessage('If an account with that email exists, a password reset link has been sent to your email.');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.join(', ') || 
                          'An error occurred while processing your request';
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles styles={{
        html: { height: '100%', overflow: 'hidden', background: 'none', margin: 0, padding: 0 },
        body: { height: '100%', overflow: 'hidden', background: 'none', margin: 0, padding: 0, border: 'none' },
        '#root': { height: '100%' },
      }} />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: '#1A2238',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: 'none',
        }}
      >
        <Container component="main" maxWidth="sm" sx={{ zIndex: 1 }}>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                bgcolor: 'rgba(26,34,56,0.95)',
                borderRadius: 4,
                boxShadow: 8,
              }}
            >
              <img src="/kernel-logo.png" alt="Kernelequity Logo" style={{ width: 130, marginBottom: 32, marginTop: 8 }} />
              <Typography component="h1" variant="h4" gutterBottom sx={{ color: '#fff' }}>
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, color: '#fff', textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
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
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isLoading}
                  sx={{ bgcolor: '#232B47', borderRadius: 1, '& .MuiInputBase-input': { color: '#fff' }, input: { color: '#fff' }, label: { color: '#fff' } }}
                  InputLabelProps={{ style: { color: '#9DAAF2' } }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: 48,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: 18,
                    background: 'linear-gradient(90deg, #FF6A3D 0%, #F4DB7D 100%)',
                    color: '#232B47',
                    boxShadow: '0 2px 8px 0 rgba(255,106,61,0.15)',
                    textTransform: 'none',
                    '&:hover': { background: 'linear-gradient(90deg, #F4DB7D 0%, #FF6A3D 100%)' },
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#9DAAF2' }}>
                    Remember your password?{' '}
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ color: '#9DAAF2' }}>
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPassword; 