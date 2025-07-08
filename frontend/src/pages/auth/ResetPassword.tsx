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
            <img src="/kernel-logo.png" alt="Kernelequity Logo" style={{ width: 220, marginBottom: 24 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#454545', mt: 1, mb: 2, textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 18, sm: 20, md: 22 } }}>
              Reset Your Password
              <Box sx={{ width: 60, height: 4, bgcolor: '#488010', borderRadius: 2, mx: 'auto', mt: 1 }} />
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
              <Typography sx={{ color: errors.password ? '#d32f2f' : '#777', fontWeight: 400, fontSize: { xs: 14, sm: 16 }, mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>New Password</Typography>
              <TextField
                fullWidth
                placeholder="Enter new password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password}
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
                  '& input': { color: errors.password ? '#d32f2f' : '#777', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 14, sm: 16 } },
                  '& .MuiFormHelperText-root': { color: '#d32f2f', fontWeight: 500 },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#488010' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography sx={{ color: errors.confirmPassword ? '#d32f2f' : '#777', fontWeight: 400, fontSize: { xs: 14, sm: 16 }, mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Confirm New Password</Typography>
              <TextField
                fullWidth
                placeholder="Confirm new password"
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
                  '& input': { color: errors.confirmPassword ? '#d32f2f' : '#777', fontFamily: 'Poppins, sans-serif', fontSize: { xs: 14, sm: 16 } },
                  '& .MuiFormHelperText-root': { color: '#d32f2f', fontWeight: 500 },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: '#488010' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  height: 48,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: 18,
                  background: '#488010',
                  color: '#fff',
                  boxShadow: '0 2px 8px 0 rgba(72,128,16,0.15)',
                  textTransform: 'none',
                  '&:hover': { background: '#366308' },
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Reset Password'
                )}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#488010' }}>
                  Remember your password?{' '}
                  <Link component={RouterLink} to="/login" variant="body2" sx={{ color: '#488010' }}>
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

export default ResetPassword; 