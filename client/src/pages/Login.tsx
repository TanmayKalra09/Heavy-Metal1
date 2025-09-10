import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Visibility, 
  VisibilityOff, 
  Email,
  Lock,
  WaterDrop,
  AccountCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { authService, LoginCredentials } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      onLogin(response.user, response.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const demoCredentials: LoginCredentials = {
      email: 'demo@example.com',
      password: 'demo123',
    };
    await onSubmit(demoCredentials);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#f8fafc',
        position: 'relative',
        mt: 7
      }}
    >
      {/* Left Panel - Branding */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 70%),
              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 70%)
            `,
          },
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            zIndex: 1,
            px: 4,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '32px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <WaterDrop sx={{ fontSize: 56, color: 'white' }} />
          </Box>
          
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            HMPI Platform
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              mb: 4,
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            Advanced Heavy Metal Pollution Index monitoring system for environmental scientists and policymakers
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mt: 6,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{
                  width: 60,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: item === 2 ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 3,
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              maxWidth: 480,
              width: '100%',
              mx: 'auto',
            }}
          >
            {/* Header */}
            <Stack alignItems="center" spacing={2} mb={4}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountCircle sx={{ fontSize: 32, color: '#3b82f6' }} />
              </Box>
              
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Welcome back
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#64748b',
                    fontWeight: 400,
                  }}
                >
                  Sign in to your account to continue
                </Typography>
              </Box>
            </Stack>

            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  '& .MuiAlert-icon': {
                    color: '#ef4444',
                  },
                  '& .MuiAlert-message': {
                    color: '#dc2626',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email address"
                      placeholder="Enter your email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#6b7280', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          borderColor: '#e2e8f0',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#cbd5e1',
                            },
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#3b82f6',
                              borderWidth: 2,
                            },
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#3b82f6',
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Password"
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#6b7280', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ 
                                color: '#6b7280',
                                '&:hover': {
                                  backgroundColor: alpha('#3b82f6', 0.04),
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          borderColor: '#e2e8f0',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#cbd5e1',
                            },
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#3b82f6',
                              borderWidth: 2,
                            },
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#3b82f6',
                        },
                      }}
                    />
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LoginIcon />}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    backgroundColor: '#3b82f6',
                    textTransform: 'none',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    },
                    '&:active': {
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <Divider sx={{ my: 1, color: '#94a3b8' }}>
                  <Typography variant="body2" sx={{ px: 2, color: '#64748b' }}>
                    or
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      borderColor: '#9ca3af',
                    },
                  }}
                >
                  Try demo account
                </Button>
              </Stack>

              {/* Footer Links */}
              <Stack spacing={2} mt={4} alignItems="center">
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Don't have an account? Sign up
                </Link>

                <Link
                  component="button"
                  type="button"
                  onClick={() => {
                    toast.info('Password reset functionality will be available soon.');
                  }}
                  sx={{
                    color: '#64748b',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#3b82f6',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot your password?
                </Link>
              </Stack>
            </Box>
          </Paper>

          {/* Bottom Text */}
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#64748b',
              mt: 6,
              px: 4,
            }}
          >
            Heavy Metal Pollution Index Platform • For CGWB Scientists and Environmental Policymakers
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;