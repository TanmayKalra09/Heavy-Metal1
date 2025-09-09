import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Container,
  useTheme,
  alpha,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard,
  CloudUpload,
  ExitToApp,
  Home,
  Science,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'rgb(240, 248, 255)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1.5 }}>
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.3s ease',
              }
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 45,
                height: 45,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(33, 150, 243, 0.05))',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2.5,
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.2)',
              }}
            >
              <Science sx={{ color: '#2196f3', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                HMPI Platform
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Heavy Metal Analysis
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <Button
              color="inherit"
              startIcon={<Home sx={{ color: isActive('/') ? '#2196f3' : 'rgba(0, 0, 0, 0.6)' }} />}
              onClick={() => navigate('/')}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 4,
                fontWeight: 600,
                textTransform: 'none',
                color: isActive('/') ? '#2196f3' : 'rgba(0, 0, 0, 0.7)',
                background: isActive('/') 
                  ? 'rgba(33, 150, 243, 0.1)'
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: isActive('/') 
                  ? '1px solid rgba(33, 150, 243, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: isActive('/') 
                    ? 'rgba(33, 150, 243, 0.15)'
                    : 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(33, 150, 243, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Home
            </Button>

            {user ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<Dashboard sx={{ color: isActive('/dashboard') ? '#2196f3' : 'rgba(0, 0, 0, 0.6)' }} />}
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 4,
                    fontWeight: 600,
                    textTransform: 'none',
                    color: isActive('/dashboard') ? '#2196f3' : 'rgba(0, 0, 0, 0.7)',
                    background: isActive('/dashboard') 
                      ? 'rgba(33, 150, 243, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: isActive('/dashboard') 
                      ? '1px solid rgba(33, 150, 243, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: isActive('/dashboard') 
                        ? 'rgba(33, 150, 243, 0.15)'
                        : 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(33, 150, 243, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  color="inherit"
                  startIcon={<CloudUpload sx={{ color: isActive('/upload') ? '#2196f3' : 'rgba(0, 0, 0, 0.6)' }} />}
                  onClick={() => navigate('/upload')}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 4,
                    fontWeight: 600,
                    textTransform: 'none',
                    color: isActive('/upload') ? '#2196f3' : 'rgba(0, 0, 0, 0.7)',
                    background: isActive('/upload') 
                      ? 'rgba(33, 150, 243, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: isActive('/upload') 
                      ? '1px solid rgba(33, 150, 243, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: isActive('/upload') 
                        ? 'rgba(33, 150, 243, 0.15)'
                        : 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(33, 150, 243, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Upload
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 4,
                    fontWeight: 600,
                    textTransform: 'none',
                    color: isActive('/login') ? '#2196f3' : 'rgba(0, 0, 0, 0.7)',
                    background: isActive('/login') 
                      ? 'rgba(33, 150, 243, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Login
                </Button>

                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 4,
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.9), rgba(25, 118, 210, 0.9))',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 1), rgba(25, 118, 210, 1))',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(33, 150, 243, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>

          {/* User Menu */}
          {user && (
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Account menu">
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    p: 0,
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                      color: 'white',
                      fontWeight: 700,
                      border: '2px solid rgba(33, 150, 243, 0.3)',
                      boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    mt: 1.5,
                    minWidth: 240,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(33, 150, 243, 0.1)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(33, 150, 243, 0.1)',
                      borderBottom: 'none',
                      borderRight: 'none',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* User Info */}
                <MenuItem 
                  disabled 
                  sx={{ 
                    py: 2, 
                    background: 'rgba(33, 150, 243, 0.05)',
                    '&.Mui-disabled': {
                      opacity: 1,
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                      color: 'white',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'rgba(0, 0, 0, 0.9)' }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>

                <Divider sx={{ borderColor: 'rgba(33, 150, 243, 0.1)' }} />

                {/* Menu Items */}
                <MenuItem 
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(33, 150, 243, 0.05)',
                    }
                  }}
                >
                  <ListItemIcon>
                    <Dashboard fontSize="small" sx={{ color: '#2196f3' }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: 'rgba(0, 0, 0, 0.8)' }}>Dashboard</ListItemText>
                </MenuItem>

                <MenuItem 
                  onClick={() => navigate('/upload')}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(33, 150, 243, 0.05)',
                    }
                  }}
                >
                  <ListItemIcon>
                    <CloudUpload fontSize="small" sx={{ color: '#2196f3' }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: 'rgba(0, 0, 0, 0.8)' }}>Upload Data</ListItemText>
                </MenuItem>

                <Divider sx={{ borderColor: 'rgba(33, 150, 243, 0.1)' }} />

                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(244, 67, 54, 0.05)',
                    }
                  }}
                >
                  <ListItemIcon>
                    <ExitToApp fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography color="error">Logout</Typography>
                  </ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;