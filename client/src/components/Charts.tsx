import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { PredictionResult } from '../api/predict';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChartsProps {
  data: PredictionResult[];
  title?: string;
  showControls?: boolean;
}

const Charts: React.FC<ChartsProps> = ({ data, title = 'Water Quality Analysis', showControls = true }) => {
  const [selectedMetal, setSelectedMetal] = React.useState<string>('arsenic');

  // Risk category distribution
  const getRiskDistribution = () => {
    const safe = data.filter(d => d.riskCategory === 'safe').length;
    const caution = data.filter(d => d.riskCategory === 'caution').length;
    const unsafe = data.filter(d => d.riskCategory === 'unsafe').length;

    return {
      labels: ['Safe', 'Caution', 'Unsafe'],
      datasets: [
        {
          data: [safe, caution, unsafe],
          backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
          borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
          borderWidth: 2,
        },
      ],
    };
  };

  // HMPI score distribution
  const getHMPIDistribution = () => {
    const scores = data.map(d => d.hmpiScore);
    const bins = [0, 25, 50, 75, 100, 150, 200, 300];
    const binCounts = new Array(bins.length - 1).fill(0);
    const binLabels = bins.slice(0, -1).map((bin, i) => `${bin}-${bins[i + 1]}`);

    scores.forEach(score => {
      for (let i = 0; i < bins.length - 1; i++) {
        if (score >= bins[i] && score < bins[i + 1]) {
          binCounts[i]++;
          break;
        }
      }
    });

    return {
      labels: binLabels,
      datasets: [
        {
          label: 'Number of Samples',
          data: binCounts,
          backgroundColor: 'rgba(25, 118, 210, 0.6)',
          borderColor: 'rgba(25, 118, 210, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Metal concentration averages
  const getMetalConcentrations = () => {
    if (data.length === 0) return { labels: [], datasets: [] };

    const metals = Object.keys(data[0].metalConcentrations);
    const averages = metals.map(metal => {
      const concentrations = data.map(d => d.metalConcentrations[metal] as number).filter(c => c !== undefined);
      return concentrations.length > 0 ? concentrations.reduce((a, b) => a + b, 0) / concentrations.length : 0;
    });

    return {
      labels: metals.map(metal => metal.charAt(0).toUpperCase() + metal.slice(1)),
      datasets: [
        {
          label: 'Average Concentration (mg/L)',
          data: averages,
          backgroundColor: 'rgba(156, 39, 176, 0.6)',
          borderColor: 'rgba(156, 39, 176, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Time series data
  const getTimeSeriesData = () => {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const dates = sortedData.map(d => new Date(d.date).toLocaleDateString());
    const scores = sortedData.map(d => d.hmpiScore);

    return {
      labels: dates,
      datasets: [
        {
          label: 'HMPI Score',
          data: scores,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1,
        },
      ],
    };
  };

  // Selected metal concentration over time
  const getMetalTimeSeriesData = () => {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const dates = sortedData.map(d => new Date(d.date).toLocaleDateString());
    const concentrations = sortedData.map(d => d.metalConcentrations[selectedMetal] as number || 0);

    return {
      labels: dates,
      datasets: [
        {
          label: `${selectedMetal.charAt(0).toUpperCase() + selectedMetal.slice(1)} Concentration (mg/L)`,
          data: concentrations,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data available for charts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload water quality data to see visualizations
        </Typography>
      </Paper>
    );
  }

  const availableMetals = data.length > 0 ? Object.keys(data[0].metalConcentrations) : [];

  return (
    <Box>
      {title && (
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
      )}

      {showControls && availableMetals.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Metal</InputLabel>
            <Select
              value={selectedMetal}
              label="Select Metal"
              onChange={(e) => setSelectedMetal(e.target.value)}
            >
              {availableMetals.map((metal) => (
                <MenuItem key={metal} value={metal}>
                  {metal.charAt(0).toUpperCase() + metal.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Risk Category Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Category Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={getRiskDistribution()} options={pieOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* HMPI Score Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                HMPI Score Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={getHMPIDistribution()} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Metal Concentrations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Metal Concentrations
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={getMetalConcentrations()} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* HMPI Time Series */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                HMPI Score Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={getTimeSeriesData()} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Selected Metal Time Series */}
        {availableMetals.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedMetal.charAt(0).toUpperCase() + selectedMetal.slice(1)} Concentration Over Time
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line data={getMetalTimeSeriesData()} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Charts;