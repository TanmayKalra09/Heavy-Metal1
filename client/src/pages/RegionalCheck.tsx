import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { LocationOn, Refresh } from '@mui/icons-material';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface MetalData {
  name: string;
  concentration: number;
  unit: string;
  safeLimit: number;
  status: 'safe' | 'warning' | 'danger';
}

const RegionalCheck: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metalData, setMetalData] = useState<MetalData[]>([]);

  const dummyMetalData: MetalData[] = [
    { name: 'Arsenic', concentration: 8.5, unit: 'μg/L', safeLimit: 10, status: 'warning' },
    { name: 'Lead', concentration: 12.3, unit: 'μg/L', safeLimit: 15, status: 'warning' },
    { name: 'Mercury', concentration: 1.2, unit: 'μg/L', safeLimit: 2, status: 'safe' },
    { name: 'Cadmium', concentration: 4.8, unit: 'μg/L', safeLimit: 5, status: 'safe' },
    { name: 'Chromium', concentration: 45.2, unit: 'μg/L', safeLimit: 50, status: 'safe' },
    { name: 'Copper', concentration: 890, unit: 'μg/L', safeLimit: 1000, status: 'safe' },
  ];

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(locationData);
        setMetalData(dummyMetalData);
        setLoading(false);
      },
      (error) => {
        setError(`Location error: ${error.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'success';
      case 'warning': return 'warning';
      case 'danger': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Regional Water Quality Check
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check heavy metal concentrations in water sources near your location
          </Typography>
        </Box>

        <Box textAlign="center" mb={4}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LocationOn />}
            onClick={getLocation}
            disabled={loading}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            {loading ? 'Getting Location...' : 'Check My Area'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {location && (
          <Box mb={4}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Location:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                <br />
                <strong>Accuracy:</strong> ±{Math.round(location.accuracy)}m
              </Typography>
            </Alert>
          </Box>
        )}

        {metalData.length > 0 && (
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h5" fontWeight="bold">
                Heavy Metal Analysis Results
              </Typography>
              <Button
                startIcon={<Refresh />}
                onClick={getLocation}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Box>

            <Grid container spacing={3}>
              {metalData.map((metal, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                          {metal.name}
                        </Typography>
                        <Chip
                          label={metal.status.toUpperCase()}
                          color={getStatusColor(metal.status) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                        {metal.concentration}
                        <Typography component="span" variant="body2" color="text.secondary" ml={1}>
                          {metal.unit}
                        </Typography>
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        Safe limit: {metal.safeLimit} {metal.unit}
                      </Typography>
                      
                      <Box mt={2}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.min((metal.concentration / metal.safeLimit) * 100, 100)}%`,
                              height: '100%',
                              backgroundColor: 
                                metal.status === 'safe' ? 'success.main' :
                                metal.status === 'warning' ? 'warning.main' : 'error.main',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box mt={4} p={3} bgcolor="grey.50" borderRadius={2}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                <strong>Note:</strong> This data is for demonstration purposes only. 
                Actual water quality data would be fetched from environmental monitoring stations 
                and government databases based on your location.
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RegionalCheck;