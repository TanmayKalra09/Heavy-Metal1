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
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          {/* Logo Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s ease',
              }
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(45deg, ${alpha(theme.palette.common.white, 0.2)}, ${alpha(theme.palette.common.white, 0.1)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              }}
            >
              <Science sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'white',
                  lineHeight: 1.2,
                }}
              >
                HMPI Platform
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: alpha(theme.palette.common.white, 0.8),
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              >
                Heavy Metal Analysis
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: isActive('/') ? alpha(theme.palette.common.white, 0.15) : 'transparent',
                backdropFilter: isActive('/') ? 'blur(10px)' : 'none',
                border: isActive('/') ? `1px solid ${alpha(theme.palette.common.white, 0.2)}` : 'none',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Home
            </Button>

            {user ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<Dashboard />}
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: isActive('/dashboard') ? alpha(theme.palette.common.white, 0.15) : 'transparent',
                    backdropFilter: isActive('/dashboard') ? 'blur(10px)' : 'none',
                    border: isActive('/dashboard') ? `1px solid ${alpha(theme.palette.common.white, 0.2)}` : 'none',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  color="inherit"
                  startIcon={<CloudUpload />}
                  onClick={() => navigate('/upload')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: isActive('/upload') ? alpha(theme.palette.common.white, 0.15) : 'transparent',
                    backdropFilter: isActive('/upload') ? 'blur(10px)' : 'none',
                    border: isActive('/upload') ? `1px solid ${alpha(theme.palette.common.white, 0.2)}` : 'none',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
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
                    py: 1,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: isActive('/login') ? alpha(theme.palette.common.white, 0.15) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    bgcolor: 'white',
                    color: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.2s ease',
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
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 700,
                      border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
                  elevation: 8,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 3,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* User Info */}
                <MenuItem disabled sx={{ py: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>
                
                <Divider />
                
                {/* Menu Items */}
                <MenuItem onClick={() => navigate('/dashboard')}>
                  <ListItemIcon>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>
                
                <MenuItem onClick={() => navigate('/upload')}>
                  <ListItemIcon>
                    <CloudUpload fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Upload Data</ListItemText>
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
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