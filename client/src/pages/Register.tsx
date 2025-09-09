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
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Stack,
  alpha,
} from '@mui/material';
import { 
  PersonAdd, 
  Visibility, 
  VisibilityOff,
  Person,
  Email,
  Lock,
  WaterDrop,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { authService, RegisterData } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface RegisterProps {
  onLogin: (user: User, token: string) => void;
}

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
  agreeToTerms: boolean;
}

const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: yup
    .boolean()
    .required('You must agree to the terms and conditions')
    .oneOf([true], 'You must agree to the terms and conditions'),
});

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const registerData: RegisterData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response = await authService.register(registerData);
      onLogin(response.user, response.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#f8fafc',
        position: 'relative',
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
            Join HMPI
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
            Create your account to access our comprehensive environmental monitoring tools and research data
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mt: 6,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 500,
              }}
            >
              Trusted by 500+ researchers worldwide
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
              }}
            >
              {[1, 2, 3].map((item) => (
                <Box
                  key={item}
                  sx={{
                    width: 60,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: item === 1 ? 'white' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Registration Form */}
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
              maxWidth: 520,
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
                <PersonAdd sx={{ fontSize: 32, color: '#3b82f6' }} />
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
                  Create Account
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#64748b',
                    fontWeight: 400,
                  }}
                >
                  Join the HMPI platform today
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
            <Box component="form" onSubmit={handleSubmit(onSubmit as any)}>
              <Stack spacing={3}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full name"
                      placeholder="Enter your full name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#6b7280', fontSize: 20 }} />
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
                      placeholder="Create a strong password"
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

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Confirm password"
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
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
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{ 
                                color: '#6b7280',
                                '&:hover': {
                                  backgroundColor: alpha('#3b82f6', 0.04),
                                },
                              }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                {/* Terms and Conditions */}
                <Box>
                  <Controller
                    name="agreeToTerms"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            disabled={loading}
                            sx={{
                              color: '#9ca3af',
                              '&.Mui-checked': {
                                color: '#3b82f6',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            I agree to the{' '}
                            <Link
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              sx={{
                                color: '#3b82f6',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              sx={{
                                color: '#3b82f6',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              Privacy Policy
                            </Link>
                          </Typography>
                        }
                        sx={{ 
                          alignItems: 'flex-start',
                          mt: 0.5,
                        }}
                      />
                    )}
                  />
                  {errors.agreeToTerms && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#ef4444',
                        mt: 0.5,
                        display: 'block',
                        fontSize: '0.75rem',
                      }}
                    >
                      {errors.agreeToTerms.message}
                    </Typography>
                  )}
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PersonAdd />}
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
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </Stack>

              {/* Footer Links */}
              <Stack spacing={2} mt={4} alignItems="center">
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/login')}
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
                  Already have an account? Sign in
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

export default Register;