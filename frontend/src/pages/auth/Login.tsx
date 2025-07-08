import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert as MuiAlert,
  GlobalStyles,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import JSEncrypt from 'jsencrypt';
import { useTheme } from '@mui/material/styles';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [publicKey, setPublicKey] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/public-key')
      .then(res => res.text())
      .then(setPublicKey);
  }, []);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please provide a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleInputChange = (field: keyof LoginFormData) => (
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

  const encryptPassword = (password: string) => {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(password) || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      let passwordToSend = formData.password;
      if (publicKey) {
        const encrypted = encryptPassword(formData.password);
        if (encrypted) passwordToSend = encrypted;
      }
      await login(formData.email, passwordToSend);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.join(', ') || 
                          'An error occurred during login';
      setGeneralError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, color: '#fff', textAlign: 'center' }}>
                Sign in to access your admin dashboard
              </Typography>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <MuiAlert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }} elevation={6} variant="filled">
                  {generalError}
                </MuiAlert>
              </Snackbar>
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
                  autoFocus
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isLoading}
                  sx={{ bgcolor: '#232B47', borderRadius: 1, '& .MuiInputBase-input': { color: '#fff' }, input: { color: '#fff' }, label: { color: '#fff' } }}
                  InputLabelProps={{ style: { color: '#9DAAF2' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
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
                    'Sign In'
                  )}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#9DAAF2' }}>
                    <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: '#9DAAF2' }}>
                      Forgot your password?
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

export default Login; 