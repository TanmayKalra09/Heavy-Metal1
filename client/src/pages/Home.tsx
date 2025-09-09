import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CloudUpload,
  Assessment,
  Security,
  Speed,
  CheckCircle,
  TrendingUp,
  Map,
  ArrowForward,
  Science,
  Analytics,
  Shield,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Custom hook for animated counter
  const useAnimatedCounter = (endValue: string, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const [suffix, setSuffix] = useState('');

    useEffect(() => {
      // Parse the end value to get the numeric part and suffix
      const numericValue = parseFloat(endValue.replace(/[^\d.]/g, ''));
      const suffixValue = endValue.replace(/[\d.]/g, '');
      setSuffix(suffixValue);

      if (!isVisible) return;

      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * numericValue);

        setCount(currentCount);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [endValue, duration, isVisible]);

    return count + suffix;
  };

  const AnimatedNumber = ({ value }: { value: string }) => {
    const animatedValue = useAnimatedCounter(value);
    return <>{animatedValue}</>;
  };

  // Intersection Observer to trigger animation when stats section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Speed />,
      title: 'Automated HMPI Computation',
      description: 'Instantly calculate Heavy Metal Pollution Index using advanced ML algorithms and standard formulas.',
      color: '#FF6B6B',
    },
    {
      icon: <CloudUpload />,
      title: 'Easy Data Upload',
      description: 'Upload CSV files with water quality data and get immediate analysis results.',
      color: '#4ECDC4',
    },
    {
      icon: <Map />,
      title: 'Geospatial Mapping',
      description: 'Visualize contamination hotspots on interactive maps with color-coded risk indicators.',
      color: '#45B7D1',
    },
    {
      icon: <Assessment />,
      title: 'Data Visualization',
      description: 'Comprehensive charts and graphs for intuitive understanding of water quality trends.',
      color: '#96CEB4',
    },
    {
      icon: <TrendingUp />,
      title: 'Real-time Predictions',
      description: 'Get instant model inference on submitted data with immediate results.',
      color: '#FFEAA7',
    },
    {
      icon: <Security />,
      title: 'Secure & Reliable',
      description: 'User authentication and secure data handling for sensitive environmental data.',
      color: '#DDA0DD',
    },
  ];

  const benefits = [
    'Reduce manual calculation errors',
    'Save time with automated analysis',
    'Make data-driven decisions',
    'Identify contamination patterns',
    'Generate comprehensive reports',
    'Monitor water quality trends',
  ];

  const stats = [
    { number: '1000+', label: 'Water Samples Analyzed', icon: <Science /> },
    { number: '99.9%', label: 'Accuracy Rate', icon: <Analytics /> },
    { number: '24/7', label: 'System Availability', icon: <Shield /> },
  ];

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%)
          `,
          zIndex: -2,
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          zIndex: -1,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(1deg)' },
          '66%': { transform: 'translateY(10px) rotate(-1deg)' },
        },
      }}
    >
      {/* Floating 3D Elements */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          '& .floating-element': {
            position: 'absolute',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'floatAround 15s ease-in-out infinite',
          },
          '& .floating-element:nth-of-type(1)': {
            width: '100px',
            height: '100px',
            top: '10%',
            left: '10%',
            animationDelay: '0s',
          },
          '& .floating-element:nth-of-type(2)': {
            width: '150px',
            height: '150px',
            top: '20%',
            right: '15%',
            animationDelay: '5s',
          },
          '& .floating-element:nth-of-type(3)': {
            width: '80px',
            height: '80px',
            bottom: '30%',
            left: '20%',
            animationDelay: '10s',
          },
          '& .floating-element:nth-of-type(4)': {
            width: '120px',
            height: '120px',
            bottom: '20%',
            right: '10%',
            animationDelay: '7s',
          },
          '@keyframes floatAround': {
            '0%, 100%': {
              transform: 'translateY(0px) translateX(0px) rotate(0deg) scale(1)',
              opacity: 0.3,
            },
            '25%': {
              transform: 'translateY(-30px) translateX(20px) rotate(90deg) scale(1.1)',
              opacity: 0.5,
            },
            '50%': {
              transform: 'translateY(-10px) translateX(-15px) rotate(180deg) scale(0.9)',
              opacity: 0.4,
            },
            '75%': {
              transform: 'translateY(20px) translateX(10px) rotate(270deg) scale(1.05)',
              opacity: 0.6,
            },
          },
        }}
      >
        <Box className="floating-element" />
        <Box className="floating-element" />
        <Box className="floating-element" />
        <Box className="floating-element" />
      </Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  animation: 'fadeInUp 1s ease-out',
                  '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(30px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 800,
                    mb: 2,
                    background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                  }}
                >
                  Heavy Metal Pollution Index
                </Typography>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 300,
                    mb: 3,
                    opacity: 0.95,
                  }}
                >
                  Automated Water Quality Analysis Platform
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    mb: 4,
                    opacity: 0.9,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                  }}
                >
                  Streamline heavy metal monitoring in groundwater with our advanced ML-powered platform. 
                  Designed for CGWB scientists and policymakers to make data-driven decisions for public health protection.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      '&:hover': {
                        bgcolor: 'grey.100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 250, md: 400 },
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                  },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 200, md: 300 },
                    height: { xs: 200, md: 300 },
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Science sx={{ fontSize: { xs: 80, md: 120 }, opacity: 0.8 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container ref={statsRef} maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h3" component="div" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                  {stat.label === 'System Availability' ? stat.number : <AnimatedNumber value={stat.number} />}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Key Features
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}
            >
              Comprehensive tools for heavy metal pollution analysis and monitoring
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 4,
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: feature.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(feature.color, 0.1),
                        color: feature.color,
                        width: 60,
                        height: 60,
                        mb: 3,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
              Why Choose Our Platform?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', mb: 4, lineHeight: 1.7 }}>
              Traditional Heavy Metal Pollution Index calculations are time-consuming and error-prone. 
              Our automated platform eliminates manual effort while providing accurate, real-time analysis.
            </Typography>
            <List sx={{ '& .MuiListItem-root': { px: 0, py: 1 } }}>
              {benefits.map((benefit, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={benefit}
                    primaryTypographyProps={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h4" component="h3" sx={{ fontWeight: 600, mb: 4 }}>
                How It Works
              </Typography>
              <Stack spacing={3}>
                {[
                  'Upload your water quality data (CSV format)',
                  'AI analyzes metal concentrations automatically',
                  'View results on interactive maps and charts',
                  'Generate and download comprehensive reports'
                ].map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        width: 40,
                        height: 40,
                        mr: 3,
                        fontWeight: 600,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z"/%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Join CGWB scientists and policymakers in making data-driven decisions for groundwater protection.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Create Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
