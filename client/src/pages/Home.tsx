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
      color: '#3B82F6',
    },
    {
      icon: <CloudUpload />,
      title: 'Easy Data Upload',
      description: 'Upload CSV files with water quality data and get immediate analysis results.',
      color: '#06B6D4',
    },
    {
      icon: <Map />,
      title: 'Geospatial Mapping',
      description: 'Visualize contamination hotspots on interactive maps with color-coded risk indicators.',
      color: '#6366F1',
    },
    {
      icon: <Assessment />,
      title: 'Data Visualization',
      description: 'Comprehensive charts and graphs for intuitive understanding of water quality trends.',
      color: '#0EA5E9',
    },
    {
      icon: <TrendingUp />,
      title: 'Real-time Predictions',
      description: 'Get instant model inference on submitted data with immediate results.',
      color: '#8B5CF6',
    },
    {
      icon: <Security />,
      title: 'Secure & Reliable',
      description: 'User authentication and secure data handling for sensitive environmental data.',
      color: '#14B8A6',
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
        bgcolor: 'rgb(248, 250, 252)',
        minHeight: '100vh',
      }}
    >
      {/* Modern Geometric Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          background: `
            linear-gradient(135deg, 
              rgba(59, 130, 246, 0.05) 0%, 
              rgba(147, 197, 253, 0.05) 25%,
              rgba(219, 234, 254, 0.05) 50%,
              rgba(239, 246, 255, 0.05) 75%,
              rgba(248, 250, 252, 0.05) 100%
            )
          `,
        }}
      />

      {/* Subtle Animated Shapes */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          '& .floating-shape': {
            position: 'absolute',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.04))',
            borderRadius: '50%',
            filter: 'blur(1px)',
            animation: 'gentleFloat 25s ease-in-out infinite',
          },
          '& .floating-shape:nth-of-type(1)': {
            width: '300px',
            height: '300px',
            top: '5%',
            right: '10%',
            animationDelay: '0s',
          },
          '& .floating-shape:nth-of-type(2)': {
            width: '200px',
            height: '200px',
            bottom: '15%',
            left: '5%',
            animationDelay: '8s',
          },
          '& .floating-shape:nth-of-type(3)': {
            width: '150px',
            height: '150px',
            top: '40%',
            left: '15%',
            animationDelay: '15s',
          },
          '@keyframes gentleFloat': {
            '0%, 100%': {
              transform: 'translate(0, 0) scale(1)',
              opacity: 0.3,
            },
            '25%': {
              transform: 'translate(30px, -30px) scale(1.05)',
              opacity: 0.2,
            },
            '50%': {
              transform: 'translate(-20px, 20px) scale(0.95)',
              opacity: 0.35,
            },
            '75%': {
              transform: 'translate(20px, -10px) scale(1.02)',
              opacity: 0.25,
            },
          },
        }}
      >
        <Box className="floating-shape" />
        <Box className="floating-shape" />
        <Box className="floating-shape" />
      </Box>

      {/* Hero Section */}
     <Box
      sx={{
        minHeight: '100vh',
         bgcolor: 'rgb(240, 248, 255)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 8, ml:10 }}>
        <Grid container spacing={8} alignItems="center" sx={{ minHeight: '80vh' }}>
          
          {/* Left Section - Content */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                maxWidth: '600px',
                animation: 'slideInLeft 0.8s ease-out',
                '@keyframes slideInLeft': {
                  '0%': { opacity: 0, transform: 'translateX(-40px)' },
                  '100%': { opacity: 1, transform: 'translateX(0)' },
                },
              }}
            >
              {/* Status Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 4,
                  py: 1.5,
                  mb: 5,
                  borderRadius: '50px',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    mr: 2,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                    },
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151',
                    letterSpacing: '0.025em',
                  }}
                >
                  AI-Powered Environmental Monitoring
                </Typography>
              </Box>

              {/* Main Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: '#0f172a',
                }}
              >
                Heavy Metal
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 700,
                  }}
                >
                  Pollution Index
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 400,
                  mb: 6,
                  color: '#64748b',
                  lineHeight: 1.7,
                  maxWidth: '540px',
                }}
              >
                Advanced machine learning platform for comprehensive water quality analysis. 
                Empowering CGWB scientists and environmental professionals with real-time insights 
                and predictive analytics.
              </Typography>

              {/* CTA Buttons */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                sx={{ mb: 8 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px 0 rgba(59, 130, 246, 0.5)',
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
                    borderColor: '#d1d5db',
                    color: '#374151',
                    backgroundColor: 'white',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    borderRadius: '12px',
                    textTransform: 'none',
                    borderWidth: 1.5,
                    '&:hover': {
                      borderColor: '#3b82f6',
                      backgroundColor: '#f8fafc',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Sign In
                </Button>
              </Stack>

              {/* Feature Highlights */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {[
                  { icon: <TrendingUp />, text: '99.9% Accuracy' },
                  { icon: <Speed />, text: 'Real-time Analysis' },
                  { icon: <Security />, text: 'Enterprise Grade' },
                ].map((feature, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5,
                      px: 3,
                      py: 1.5,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Box
                      sx={{
                        color: '#3b82f6',
                        fontSize: 18,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      {feature.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Section - Visual */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: { xs: '400px', md: '600px' },
                position: 'relative',
                animation: 'slideInRight 0.8s ease-out 0.3s both',
                '@keyframes slideInRight': {
                  '0%': { opacity: 0, transform: 'translateX(40px)' },
                  '100%': { opacity: 1, transform: 'translateX(0)' },
                },
              }}
            >
              {/* Main Dashboard Card */}
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '300px', md: '400px', lg: '450px' },
                  height: { xs: '350px', md: '450px', lg: '650px' },
                  backgroundColor: 'white',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  border: '1px solid #f1f5f9',
                  padding: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }}
              >
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Analytics sx={{ color: '#3b82f6', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                        HMPI Dashboard
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Real-time monitoring
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Stats Cards */}
                <Stack spacing={3} sx={{ flex: 1 }}>
                  {[
                    { label: 'Water Quality Index', value: '8.7', trend: '+2.3%', color: '#10b981' },
                    { label: 'Heavy Metal Concentration', value: '0.03', trend: '-5.1%', color: '#f59e0b' },
                    { label: 'Risk Assessment', value: 'Low', trend: 'Stable', color: '#3b82f6' },
                  ].map((stat, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 3,
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          backgroundColor: stat.color,
                          color: 'white',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {stat.trend}
                      </Box>
                    </Box>
                  ))}
                </Stack>

                {/* Status Indicator */}
                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    backgroundColor: '#ecfdf5',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#065f46', fontWeight: 500 }}>
                    All systems operational
                  </Typography>
                </Box>
              </Box>

              {/* Floating Elements */}
              {/*  */}
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>

      {/* Stats Section */}
      <Container ref={statsRef} maxWidth="lg" sx={{ py: 5, mt:1 }}>
  <Grid container spacing={4}>
    {stats.map((stat, index) => (
      <Grid item xs={12} md={4} key={index}>
        <Card
          sx={{
            textAlign: 'center',
            p: 4,
            height: '100%',
            bgcolor: 'rgba(255, 255, 255, 0.75)',
            borderRadius: 3,
            border: '1px solid rgba(59, 130, 246, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)',
              borderColor: 'rgba(59, 130, 246, 0.4)',
            },
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              color: 'white',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            {React.cloneElement(stat.icon, { sx: { fontSize: 36 } })}
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'rgb(30, 41, 59)',
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            {stat.label === 'System Availability' ? stat.number : <AnimatedNumber value={stat.number} />}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgb(100, 116, 139)',
              fontWeight: 500,
              fontSize: '1.1rem',
            }}
          >
            {stat.label}
          </Typography>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'rgb(240, 248, 255)', py: 12 }}>
  <Container maxWidth="lg">
    <Box sx={{ textAlign: 'center', mb: 8 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          fontWeight: 700,
          mb: 3,
          color: 'rgb(30, 41, 59)',
          letterSpacing: '-0.02em',
        }}
      >
        Key Features
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'rgb(100, 116, 139)',
          maxWidth: '600px',
          mx: 'auto',
          lineHeight: 1.6,
          fontSize: '1.25rem',
          fontWeight: 400,
        }}
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
              p: 4,
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(200, 210, 240, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                borderColor: feature.color,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: feature.color,
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease',
              },
              '&:hover::before': {
                transform: 'scaleX(1)',
              },
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  color: feature.color,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                {React.cloneElement(feature.icon, { sx: { fontSize: 32 } })}
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: 'rgb(30, 41, 59)',
                  fontSize: '1.35rem',
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgb(100, 116, 139)',
                  lineHeight: 1.6,
                  fontSize: '1rem',
                }}
              >
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
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={10} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mb: 4, 
                color: 'rgb(30, 41, 59)',
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.02em'
              }}
            >
              Why Choose Our Platform?
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgb(100, 116, 139)', 
                fontSize: '1.2rem', 
                mb: 5, 
                lineHeight: 1.7 
              }}
            >
              Traditional Heavy Metal Pollution Index calculations are time-consuming and error-prone. 
              Our automated platform eliminates manual effort while providing accurate, real-time analysis.
            </Typography>
            <List sx={{ '& .MuiListItem-root': { px: 0, py: 1.5 } }}>
              {benefits.map((benefit, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1,
                      }}
                    >
                      <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={benefit}
                    primaryTypographyProps={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      color: 'rgb(51, 65, 85)',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 6,
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(99, 102, 241) 100%)',
                color: 'white',
                boxShadow: '0 25px 50px rgba(59, 130, 246, 0.25)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0 0 0 100px',
                },
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 5,
                  fontSize: { xs: '1.75rem', md: '2.25rem' }
                }}
              >
                How It Works
              </Typography>
              <Stack spacing={4}>
                {[
                  'Upload your water quality data (CSV format)',
                  'AI analyzes metal concentrations automatically',
                  'View results on interactive maps and charts',
                  'Generate and download comprehensive reports'
                ].map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 4,
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: '1.15rem', 
                        fontWeight: 400,
                        lineHeight: 1.5
                      }}
                    >
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
    background: 'linear-gradient(135deg, rgba(14, 42, 102, 0.9) 0%, rgba(30, 58, 138, 0.85) 100%)',
    color: 'white',
    py: 12,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
        radial-gradient(circle at 70% 60%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)
      `,
    },
  }}
>
  <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
    <Typography
      variant="h3"
      sx={{
        fontWeight: 700,
        mb: 3,
        fontSize: { xs: '2rem', md: '2.75rem' },
        letterSpacing: '-0.015em',
        textShadow: '0 4px 8px rgba(0,0,0,0.2)',
      }}
    >
      Ready to Empower Groundwater Decisions?
    </Typography>
    <Typography
      variant="h6"
      sx={{
        mb: 6,
        opacity: 0.85,
        maxWidth: '600px',
        mx: 'auto',
        lineHeight: 1.7,
        fontSize: '1.15rem',
        fontWeight: 400,
      }}
    >
      Collaborate with CGWB scientists and policymakers to leverage data-driven insights for sustainable groundwater management.
    </Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/register')}
        endIcon={<ArrowForward />}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          px: 6,
          py: 1.8,
          fontSize: '1.1rem',
          fontWeight: 600,
          borderRadius: 3,
          textTransform: 'none',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        Create Account
      </Button>
      <Button
        variant="outlined"
        size="large"
        onClick={() => navigate('/login')}
        sx={{
          borderColor: 'rgba(255,255,255,0.4)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          px: 6,
          py: 1.8,
          fontSize: '1.1rem',
          fontWeight: 500,
          borderRadius: 3,
          textTransform: 'none',
          borderWidth: 1.5,
          '&:hover': {
            borderColor: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
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