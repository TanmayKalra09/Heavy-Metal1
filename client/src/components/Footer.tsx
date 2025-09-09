import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Science,
  Email,
  Phone,
  LocationOn,
  GitHub,
  LinkedIn,
  Twitter,
  ArrowUpward,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    platform: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Upload Data', href: '/upload' },
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
    ],
    resources: [
      { name: 'User Guide', href: '#' },
      { name: 'Tutorials', href: '#' },
      { name: 'Research Papers', href: '#' },
      { name: 'Case Studies', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Support', href: '#' },
      { name: 'System Status', href: '#' },
      { name: 'Report Issues', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Data Usage Policy', href: '#' },
      { name: 'Compliance', href: '#' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        color: 'white',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Main Footer Content */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Science sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      HMPI Platform
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Heavy Metal Analysis
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3, lineHeight: 1.6 }}>
                  Advanced ML-powered platform for heavy metal pollution analysis in groundwater. 
                  Designed for CGWB scientists and environmental policymakers.
                </Typography>
                
                {/* Contact Info */}
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      support@hmpi-platform.gov.in
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      +91-11-2345-6789
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      New Delhi, India
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Links Sections */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                    Platform
                  </Typography>
                  <Stack spacing={1}>
                    {footerLinks.platform.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        color="inherit"
                        underline="none"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.875rem',
                          '&:hover': {
                            opacity: 1,
                            color: theme.palette.primary.light,
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                    Resources
                  </Typography>
                  <Stack spacing={1}>
                    {footerLinks.resources.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        color="inherit"
                        underline="none"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.875rem',
                          '&:hover': {
                            opacity: 1,
                            color: theme.palette.primary.light,
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                    Support
                  </Typography>
                  <Stack spacing={1}>
                    {footerLinks.support.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        color="inherit"
                        underline="none"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.875rem',
                          '&:hover': {
                            opacity: 1,
                            color: theme.palette.primary.light,
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                    Legal
                  </Typography>
                  <Stack spacing={1}>
                    {footerLinks.legal.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        color="inherit"
                        underline="none"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.875rem',
                          '&:hover': {
                            opacity: 1,
                            color: theme.palette.primary.light,
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.1) }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2024 Heavy Metal Pollution Index Platform. All rights reserved. | Government of India
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <GitHub fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
            </Box>

            {/* Back to Top Button */}
            <IconButton
              onClick={scrollToTop}
              sx={{
                ml: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.light,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;