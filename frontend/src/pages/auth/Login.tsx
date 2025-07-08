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
import '@fontsource/poppins';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
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
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Only clear error for email or password fields
    if ((field === 'email' || field === 'password') && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
      await login(formData.email, passwordToSend, formData.rememberMe);
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
        html: { minHeight: '100%', background: 'none', fontFamily: 'Poppins, sans-serif', overflow: 'hidden', width: '100vw' },
        body: { minHeight: '100%', background: 'none', fontFamily: 'Poppins, sans-serif', overflow: 'hidden', width: '100vw' },
        '#root': { minHeight: '100%', overflow: 'hidden' },
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
              maxWidth: 450,
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
            <img src="/kernel-logo.png" alt="Kernelequity Logo" style={{ width: 220, marginBottom: 24 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#454545', mt: 1, mb: 2, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 18, sm: 20, md: 22 } }}>
              Welcome To Kernelequity
              <Box sx={{ width: 60, height: 4, bgcolor: '#488010', borderRadius: 2, mx: 'auto', mt: 1 }} />
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
              <Typography sx={{ color: errors.email || generalError.toLowerCase().includes('email') || generalError.toLowerCase().includes('details') ? '#d32f2f' : '#777', fontWeight: 400, fontSize: { xs: 14, sm: 16 }, mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Usarname</Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                variant="outlined"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email || generalError.toLowerCase().includes('email') || generalError.toLowerCase().includes('details')}
                helperText={errors.email || (generalError.toLowerCase().includes('email') || generalError.toLowerCase().includes('details') ? generalError : '')}
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
                  '& input': { color: errors.email || generalError.toLowerCase().includes('email') || generalError.toLowerCase().includes('details') ? '#d32f2f' : '#777', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 14, sm: 16 } },
                  '& .MuiFormHelperText-root': { color: '#d32f2f', fontWeight: 500 },
                }}
                InputProps={{ style: { color: '#777' } }}
              />
              <Typography sx={{ color: errors.password || generalError.toLowerCase().includes('password') ? '#d32f2f' : '#777', fontWeight: 400, fontSize: { xs: 14, sm: 16 }, mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Password</Typography>
              <TextField
                fullWidth
                placeholder="Enter your password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password || generalError.toLowerCase().includes('password')}
                helperText={errors.password || (generalError.toLowerCase().includes('password') ? generalError : '')}
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
                  '& input': { color: errors.password || generalError.toLowerCase().includes('password') ? '#d32f2f' : '#777', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 14, sm: 16 } },
                  '& .MuiFormHelperText-root': { color: '#d32f2f', fontWeight: 500 },
                }}
                InputProps={{
                  style: { color: '#777' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#777' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange('rememberMe')}
                    style={{ accentColor: '#488010', marginRight: 6 }}
                  />
                  <Typography sx={{ color: '#777', fontSize: { xs: 12, sm: 14 }, fontFamily: 'Poppins, sans-serif' }}>Remember Me</Typography>
                </Box>
                <Link component={RouterLink} to="/forgot-password" sx={{ color: '#777', fontSize: { xs: 12, sm: 14 }, fontFamily: 'Poppins, sans-serif', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Box>
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Login; 