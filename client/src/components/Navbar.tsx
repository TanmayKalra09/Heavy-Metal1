import React, { useState, useEffect, useRef } from 'react';
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
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Dashboard,
  CloudUpload,
  ExitToApp,
  Science,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

// --- Important Note for Implementation ---
// Since the AppBar is now `position: "fixed"`, you'll need to add a spacer
// in your main App layout to prevent content from being hidden underneath it.
// You can use a `Toolbar` component from MUI for this.
// Example in your App.js or main layout file:
//
// import { Toolbar } from '@mui/material';
//
// <Navbar ... />
// <Toolbar />
// <main>...</main>
//

interface User {
  id: string;
  name: string;
  email: string;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

// Nav links now only contain items for the sliding pill group (auth users)
const navLinks = [
  { name: 'Dashboard', path: '/dashboard', authRequired: true },
  { name: 'Upload', path: '/upload', authRequired: true },
];

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [pillStyle, setPillStyle] = useState({});

  // Effect to handle the sliding pill animation
  useEffect(() => {
    const activeLink = navContainerRef.current?.querySelector<HTMLAnchorElement>(`[href="${location.pathname}"]`);

    if (activeLink) {
      setPillStyle({
        width: activeLink.offsetWidth,
        left: activeLink.offsetLeft,
        opacity: 1,
      });
    } else {
      // Hide pill if no link is active or if user is logged out
      setPillStyle({ ...pillStyle, opacity: 0 });
    }
  }, [location.pathname, user]); // Re-calculate when path or user changes

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    onLogout();
    handleCloseUserMenu();
    navigate('/');
  };

  const menuPaperStyles = {
    elevation: 0,
    sx: {
      overflow: 'visible',
      mt: 1.5,
      minWidth: 240,
      borderRadius: 4,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(209, 213, 219, 0.3)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(145deg, #1e88e5, #42a5f5)',
                boxShadow: '0 4px 12px rgba(30, 136, 229, 0.3)',
              }}
            >
              <Science sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', display: { xs: 'none', sm: 'block'} }}>
              HMPI Platform
            </Typography>
          </Box>

          {/* Desktop Navigation with Sliding Pill */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative', alignItems: 'center', height: '100%' }} ref={navContainerRef}>
            {/* The Sliding Pill */}
            <Box
              component="span"
              sx={{
                position: 'absolute',
                ...pillStyle,
                height: '36px',
                background: 'rgba(30, 136, 229, 0.1)',
                border: '1px solid rgba(30, 136, 229, 0.2)',
                borderRadius: '18px',
                zIndex: -1,
                transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
              }}
            />
            {navLinks.map((link) => (
              // This logic now correctly only shows links if auth is required AND user exists.
              (link.authRequired ? user : true) && (
                <Button
                  key={link.name}
                  component={NavLink}
                  to={link.path}
                  sx={{
                    mx: 1,
                    px: 2,
                    color: 'text.secondary',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: '18px',
                    zIndex: 1,
                    '&.active': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  }}
                >
                  {link.name}
                </Button>
              )
            ))}
          </Box>
          
          {/* Auth Buttons & User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <Tooltip title="Account menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ background: 'linear-gradient(145deg, #1e88e5, #42a5f5)', width: 40, height: 40 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                {/* NEW: Login button with the design of the main nav links */}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 2,
                    color: 'text.secondary',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: '18px',
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  disableElevation
                  sx={{
                    borderRadius: '18px',
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(145deg, #1976d2, #2196f3)',
                    boxShadow: '0 4px 20px rgba(30, 136, 229, 0.4)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(30, 136, 229, 0.5)',
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            )}

            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton onClick={handleOpenNavMenu} color="inherit" sx={{ color: 'text.primary' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* User Menu Dropdown */}
          <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} PaperProps={menuPaperStyles}>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
            <MenuItem onClick={() => { navigate('/dashboard'); handleCloseUserMenu(); }}>
              <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>Dashboard
            </MenuItem>
            <MenuItem onClick={() => { navigate('/upload'); handleCloseUserMenu(); }}>
              <ListItemIcon><CloudUpload fontSize="small" /></ListItemIcon>Upload Data
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><ExitToApp fontSize="small" color="error" /></ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>

          {/* Mobile Navigation Menu Dropdown */}
          <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} PaperProps={menuPaperStyles}>
             {/* Show links for logged-in users */}
             {user && navLinks.filter(l => l.authRequired).map(link => (
                <MenuItem key={link.name} onClick={() => { navigate(link.path); handleCloseNavMenu(); }}>{link.name}</MenuItem>
             ))}

             {/* Add a divider if both sections will show */}
             {user && !user && <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />}

             {/* Show login/register for guests */}
             {!user && (
              <Box>
                <MenuItem onClick={() => { navigate('/login'); handleCloseNavMenu(); }}>Login</MenuItem>
                <MenuItem onClick={() => { navigate('/register'); handleCloseNavMenu(); }}>Get Started</MenuItem>
              </Box>
             )}
          </Menu>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;