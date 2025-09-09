import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload,
  Assessment,
  Map,
  Refresh,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { predictService, PredictionResult } from '../api/predict';
import MapView from '../components/MapView';
import Charts from '../components/Charts';
import DataTable from '../components/DataTable';
import ReportDownload from '../components/ReportDownload';

interface User {
  id: string;
  name: string;
  email: string;
}

interface DashboardProps {
  user: User;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResult | null>(null);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictService.getAllPredictions(1, 100);
      setPredictions(response.predictions);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load predictions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMarkerClick = (prediction: PredictionResult) => {
    setSelectedPrediction(prediction);
    setTabValue(2); // Switch to data table tab
  };

  const handleRowClick = (prediction: PredictionResult) => {
    setSelectedPrediction(prediction);
    // Could open a detailed view modal here
  };

  const getStatistics = () => {
    const total = predictions.length;
    const safe = predictions.filter(p => p.riskCategory === 'safe').length;
    const caution = predictions.filter(p => p.riskCategory === 'caution').length;
    const unsafe = predictions.filter(p => p.riskCategory === 'unsafe').length;
    const averageHMPI = total > 0 
      ? predictions.reduce((sum, p) => sum + p.hmpiScore, 0) / total 
      : 0;

    return { total, safe, caution, unsafe, averageHMPI };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={loadPredictions} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => navigate('/upload')}
            >
              Upload Data
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Samples
                    </Typography>
                    <Typography variant="h4">
                      {stats.total}
                    </Typography>
                  </Box>
                  <DashboardIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Safe Samples
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {stats.safe}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.total > 0 ? Math.round((stats.safe / stats.total) * 100) : 0}%
                    </Typography>
                  </Box>
                  <CheckCircle color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Caution Samples
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {stats.caution}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.total > 0 ? Math.round((stats.caution / stats.total) * 100) : 0}%
                    </Typography>
                  </Box>
                  <Warning color="warning" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Unsafe Samples
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {stats.unsafe}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.total > 0 ? Math.round((stats.unsafe / stats.total) * 100) : 0}%
                    </Typography>
                  </Box>
                  <Error color="error" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Average HMPI Score */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Average HMPI Score
              </Typography>
              <Typography variant="h3" component="div">
                {stats.averageHMPI.toFixed(2)}
              </Typography>
              <Chip
                label={
                  stats.averageHMPI > 100 ? 'High Risk' :
                  stats.averageHMPI > 50 ? 'Moderate Risk' : 'Low Risk'
                }
                color={
                  stats.averageHMPI > 100 ? 'error' :
                  stats.averageHMPI > 50 ? 'warning' : 'success'
                }
                sx={{ mt: 1 }}
              />
            </Box>
            <TrendingUp sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>
        </Paper>

        {predictions.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <CloudUpload sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Data Available
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Upload your first water quality dataset to start analyzing heavy metal pollution.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<CloudUpload />}
              onClick={() => navigate('/upload')}
            >
              Upload Data
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                <Tab
                  label="Map View"
                  icon={<Map />}
                  iconPosition="start"
                  id="dashboard-tab-0"
                  aria-controls="dashboard-tabpanel-0"
                />
                <Tab
                  label="Charts"
                  icon={<Assessment />}
                  iconPosition="start"
                  id="dashboard-tab-1"
                  aria-controls="dashboard-tabpanel-1"
                />
                <Tab
                  label="Data Table"
                  icon={<DashboardIcon />}
                  iconPosition="start"
                  id="dashboard-tab-2"
                  aria-controls="dashboard-tabpanel-2"
                />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <MapView
                predictions={predictions}
                onMarkerClick={handleMarkerClick}
                height={500}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Charts data={predictions} />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <DataTable
                data={predictions}
                onRowClick={handleRowClick}
                showActions={true}
              />
            </TabPanel>
          </Paper>
        )}

        {/* Report Generation */}
        {predictions.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Generate Reports
            </Typography>
            <ReportDownload
              predictions={predictions}
              onReportGenerated={(reportId) => {
                toast.success('Report generated successfully!');
              }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;