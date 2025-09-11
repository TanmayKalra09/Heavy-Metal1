import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import RegionalCheck from './pages/RegionalCheck';
import Forecast from './pages/Forecast';
import Map from './pages/Map';

interface User {
  id: string;
  email: string;
  name: string;
}

// 1. Define a default "guest" user object
const guestUser: User = {
  id: '0',
  name: 'Guest',
  email: 'guest@example.com',
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user info
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Register onLogin={handleLogin} />
            }
          />
          <Route
            path="/dashboard"
            element={
              // 2. Pass the real user if they exist, otherwise pass the guest user.
              <Container maxWidth="xl" sx={{ py: 3 }}>
                <Dashboard user={user || guestUser} />
              </Container>
            }
          />
          <Route
            path="/upload"
            element={
              // 3. Do the same for the Upload component.
              <Container maxWidth="xl" sx={{ py: 3 }}>
                <Upload user={user || guestUser} />
              </Container>
            }
          />
          <Route
            path="/regional-check"
            element={<RegionalCheck />}
          />
          <Route
            path="/forecast"
            element={<Forecast />}
          />
          <Route
            path="/map"
            element={<Map />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;