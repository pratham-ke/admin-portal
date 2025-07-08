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
  InputAdornment,
  IconButton,
  GlobalStyles,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState<string>('');

  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setGeneralError('Invalid or missing reset token. Please request a new password reset link.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  // Validation functions
  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword);
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleInputChange = (field: keyof ResetPasswordFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error when user makes changes
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setGeneralError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      await resetPassword(token, formData.password, formData.confirmPassword);
      setSuccessMessage('Password reset! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.join(', ') || 
                          'An error occurred while resetting your password';
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
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
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  Invalid or missing reset token. Please request a new password reset link.
                </Alert>
                <Button
                  component={RouterLink}
                  to="/forgot-password"
                  variant="contained"
                  sx={{ mt: 2, background: 'linear-gradient(90deg, #FF6A3D 0%, #F4DB7D 100%)', color: '#232B47', fontWeight: 600, fontSize: 18, borderRadius: 3, boxShadow: '0 2px 8px 0 rgba(255,106,61,0.15)', textTransform: 'none' }}
                >
                  Request New Reset Link
                </Button>
              </Paper>
            </Box>
          </Container>
        </Box>
      </>
    );
  }

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
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, color: '#fff', textAlign: 'center' }}>
                Enter your new password below.
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
                  name="password"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={isLoading}
                  sx={{ bgcolor: '#232B47', borderRadius: 1, '& .MuiInputBase-input': { color: '#fff' }, input: { color: '#fff' }, label: { color: '#fff' } }}
                  InputLabelProps={{ style: { color: '#9DAAF2' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#9DAAF2' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={isLoading}
                  sx={{ bgcolor: '#232B47', borderRadius: 1, '& .MuiInputBase-input': { color: '#fff' }, input: { color: '#fff' }, label: { color: '#fff' } }}
                  InputLabelProps={{ style: { color: '#9DAAF2' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#9DAAF2' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, height: 48, borderRadius: 3, fontWeight: 600, fontSize: 18, background: 'linear-gradient(90deg, #FF6A3D 0%, #F4DB7D 100%)', color: '#232B47', boxShadow: '0 2px 8px 0 rgba(255,106,61,0.15)', textTransform: 'none', '&:hover': { background: 'linear-gradient(90deg, #F4DB7D 0%, #FF6A3D 100%)' } }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Reset Password'
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

export default ResetPassword; 