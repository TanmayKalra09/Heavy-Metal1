import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Paper, Typography, Chip, Button } from '@mui/material';
import { LocationOn, Info } from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PredictionResult } from '../api/predict';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  predictions: PredictionResult[];
  center?: [number, number];
  zoom?: number;
  height?: string | number;
  onMarkerClick?: (prediction: PredictionResult) => void;
  showControls?: boolean;
}

// Custom icons for different risk categories
const createCustomIcon = (category: 'safe' | 'caution' | 'unsafe') => {
  const colors = {
    safe: '#4caf50',
    caution: '#ff9800',
    unsafe: '#f44336',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${colors[category]};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to fit map bounds to markers
const FitBounds: React.FC<{ predictions: PredictionResult[] }> = ({ predictions }) => {
  const map = useMap();

  useEffect(() => {
    if (predictions.length > 0) {
      const bounds = L.latLngBounds(
        predictions.map((p) => [p.location.latitude, p.location.longitude])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [predictions, map]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({
  predictions,
  center = [20.5937, 78.9629], // Center of India
  zoom = 5,
  height = 400,
  onMarkerClick,
  showControls = true,
}) => {
  const mapRef = useRef<L.Map>(null);

  const getRiskColor = (category: 'safe' | 'caution' | 'unsafe') => {
    switch (category) {
      case 'safe':
        return 'success';
      case 'caution':
        return 'warning';
      case 'unsafe':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatistics = () => {
    const total = predictions.length;
    const safe = predictions.filter((p) => p.riskCategory === 'safe').length;
    const caution = predictions.filter((p) => p.riskCategory === 'caution').length;
    const unsafe = predictions.filter((p) => p.riskCategory === 'unsafe').length;

    return { total, safe, caution, unsafe };
  };

  const stats = getStatistics();

  return (
    <Box>
      {showControls && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Water Quality Map
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="body2">
              Total Samples: {stats.total}
            </Typography>
            <Chip
              label={`Safe: ${stats.safe}`}
              color="success"
              size="small"
              variant="outlined"
            />
            <Chip
              label={`Caution: ${stats.caution}`}
              color="warning"
              size="small"
              variant="outlined"
            />
            <Chip
              label={`Unsafe: ${stats.unsafe}`}
              color="error"
              size="small"
              variant="outlined"
            />
          </Box>
        </Paper>
      )}

      <Paper sx={{ height, overflow: 'hidden' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {predictions.length > 0 && <FitBounds predictions={predictions} />}

          {predictions.map((prediction) => (
            <Marker
              key={prediction.id}
              position={[prediction.location.latitude, prediction.location.longitude]}
              icon={createCustomIcon(prediction.riskCategory)}
              eventHandlers={{
                click: () => onMarkerClick?.(prediction),
              }}
            >
              <Popup>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Sample #{prediction.id.slice(-6)}
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={prediction.riskCategory.toUpperCase()}
                      color={getRiskColor(prediction.riskCategory) as any}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" gutterBottom>
                    <strong>HMPI Score:</strong> {prediction.hmpiScore.toFixed(2)}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    <strong>Date:</strong> {formatDate(prediction.date)}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    <strong>Location:</strong> {prediction.location.latitude.toFixed(4)}, {prediction.location.longitude.toFixed(4)}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    <strong>Metal Concentrations:</strong>
                  </Typography>
                  
                  <Box sx={{ maxHeight: 100, overflow: 'auto' }}>
                    {Object.entries(prediction.metalConcentrations).map(([metal, concentration]) => (
                      <Typography key={metal} variant="caption" display="block">
                        {metal}: {(concentration as number).toFixed(3)} mg/L
                      </Typography>
                    ))}
                  </Box>

                  {onMarkerClick && (
                    <Button
                      size="small"
                      startIcon={<Info />}
                      onClick={() => onMarkerClick(prediction)}
                      sx={{ mt: 1 }}
                    >
                      View Details
                    </Button>
                  )}
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>

      {predictions.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No data to display
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload water quality data to see locations on the map
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MapView;