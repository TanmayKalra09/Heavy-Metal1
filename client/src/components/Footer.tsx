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
  InputBase,
  Button,
} from '@mui/material';
import {
  Science,
  GitHub,
  LinkedIn,
  Twitter,
  ArrowForward,
} from '@mui/icons-material';

const MinimalistFooter: React.FC = () => {
  const theme = useTheme();

  const footerLinks = [
    { name: 'Platform Status', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#121212', // A sophisticated near-black
        color: theme.palette.grey[500],
        borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section: Brand and Newsletter */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={5} alignItems="center">
            {/* Brand Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: alpha(theme.palette.common.white, 0.05),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <Science sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                    HMPI Platform
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
                    Advancing Groundwater Analysis
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.7, maxWidth: '420px' }}>
                Leveraging machine learning to provide actionable insights for environmental scientists and policymakers in India.
              </Typography>
            </Grid>

            {/* Newsletter Signup */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
                Stay Updated
              </Typography>
              <Typography variant="body2" sx={{ mb: 2.5, color: theme.palette.grey[400] }}>
                Join our mailing list for platform updates and research highlights.
              </Typography>
              <Stack direction="row" spacing={1}>
                <InputBase
                  placeholder="Enter your email"
                  sx={{
                    flexGrow: 1,
                    px: 2,
                    py: 0.5,
                    backgroundColor: alpha(theme.palette.common.white, 0.08),
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.12),
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.common.white, 0.12),
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <ArrowForward />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.1) }} />

        {/* Bottom Section: Copyright, Links, and Socials */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Heavy Metal Pollution Index Platform | NIC, India
          </Typography>

          <Stack direction="row" alignItems="center" spacing={{ xs: 2, sm: 3 }}>
            {/* Footer Links */}
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                underline="none"
                sx={{
                  fontSize: '0.8rem',
                  color: theme.palette.grey[400],
                  transition: 'color 0.2s',
                  '&:hover': { color: 'white' },
                }}
              >
                {link.name}
              </Link>
            ))}
            
            <Divider orientation="vertical" flexItem sx={{ borderColor: alpha(theme.palette.common.white, 0.2), display: { xs: 'none', sm: 'block' } }} />
            
            {/* Social Icons */}
            <Stack direction="row" spacing={1}>
              {[<GitHub />, <LinkedIn />, <Twitter />].map((icon, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    color: theme.palette.grey[500],
                    '&:hover': { color: 'white', backgroundColor: 'transparent' },
                    transition: 'color 0.2s ease',
                  }}
                >
                  {React.cloneElement(icon, { sx: { fontSize: 20 } })}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default MinimalistFooter;