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
  Stack,
  Divider,
  Badge,
  useTheme,
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
  Timeline,
  DataUsage,
  Insights,
  NotificationsNone,
  MoreVert,
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
  const theme = useTheme();
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

  const MetricCard = ({ title, value, change, icon, color = '#3b82f6', trend = 'up' }: any) => (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: '12px', 
              bgcolor: color + '15',
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
          {value}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {title}
        </Typography>
        
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              size="small"
              label={change}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: trend === 'up' ? '#dcfce7' : '#fef2f2',
                color: trend === 'up' ? '#16a34a' : '#dc2626',
                border: 'none',
                height: '24px'
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ pt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Stack alignItems="center" spacing={3}>
              <CircularProgress size={48} thickness={4} sx={{ color: '#3b82f6' }} />
              <Typography variant="h6" color="text.secondary">
                Loading your dashboard...
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pt: 6 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#0f172a',
                  mb: 1
                }}
              >
                Water Quality Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Welcome back, {user.name} · Track water quality metrics and pollution levels
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} alignItems="center">              
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={loadPredictions} 
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#f1f5f9', 
                    color: '#64748b',
                    '&:hover': { bgcolor: '#e2e8f0' }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => navigate('/upload')}
                sx={{
                  bgcolor: '#3b82f6',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                  '&:hover': {
                    bgcolor: '#2563eb',
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.5)',
                  }
                }}
              >
                Upload New Data
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: '12px',
                border: '1px solid #fee2e2',
                bgcolor: '#fef2f2'
              }}
            >
              {error}
            </Alert>
          )}
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Total Samples"
              value={stats.total.toLocaleString()}
              change="+12%"
              icon={<DataUsage />}
              color="#3b82f6"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Safe Samples"
              value={stats.safe.toLocaleString()}
              change={`${stats.total > 0 ? Math.round((stats.safe / stats.total) * 100) : 0}%`}
              icon={<CheckCircle />}
              color="#10b981"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Caution Required"
              value={stats.caution.toLocaleString()}
              change={`${stats.total > 0 ? Math.round((stats.caution / stats.total) * 100) : 0}%`}
              icon={<Warning />}
              color="#f59e0b"
              trend="down"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Unsafe Samples"
              value={stats.unsafe.toLocaleString()}
              change={`${stats.total > 0 ? Math.round((stats.unsafe / stats.total) * 100) : 0}%`}
              icon={<Error />}
              color="#ef4444"
              trend="down"
            />
          </Grid>
        </Grid>

        {/* HMPI Score Card */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card 
              sx={{ 
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    HMPI Analysis
                  </Typography>
                  <Chip
                    icon={<Timeline />}
                    label="Real-time"
                    size="small"
                    sx={{
                      bgcolor: '#dcfce7',
                      color: '#16a34a',
                      fontWeight: 600
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2 }}>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 800,
                      color: '#3b82f6'
                    }}
                  >
                    {stats.averageHMPI.toFixed(1)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Average Score
                  </Typography>
                </Box>
                
                <Chip
                  label={
                    stats.averageHMPI > 100 ? 'High Risk Level' :
                    stats.averageHMPI > 50 ? 'Moderate Risk Level' : 'Low Risk Level'
                  }
                  sx={{
                    bgcolor: stats.averageHMPI > 100 ? '#fef2f2' :
                             stats.averageHMPI > 50 ? '#fffbeb' : '#dcfce7',
                    color: stats.averageHMPI > 100 ? '#dc2626' :
                           stats.averageHMPI > 50 ? '#d97706' : '#16a34a',
                    fontWeight: 600,
                    borderRadius: '8px'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                height: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Insights sx={{ fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Quick Insights
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      Risk Distribution
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {stats.total > 0 ? `${Math.round((stats.safe / stats.total) * 100)}% Safe` : 'No Data'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      Trend
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Improving
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        {predictions.length === 0 ? (
          <Card 
            sx={{ 
              borderRadius: '16px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent sx={{ p: 8, textAlign: 'center' }}>
              <Box 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '20px', 
                  bgcolor: '#eff6ff',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <CloudUpload sx={{ fontSize: 40 }} />
              </Box>
              
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                Ready to Analyze Water Quality?
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480, mx: 'auto' }}>
                Upload your water quality dataset to start monitoring heavy metal pollution levels and generate comprehensive reports.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUpload />}
                onClick={() => navigate('/upload')}
                sx={{
                  bgcolor: '#3b82f6',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                }}
              >
                Upload Your First Dataset
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card 
            sx={{ 
              borderRadius: '16px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              borderBottom: '1px solid #f1f5f9',
              bgcolor: 'white'
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  px: 2,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#64748b',
                    minHeight: 56,
                    '&.Mui-selected': {
                      color: '#3b82f6',
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#3b82f6',
                    height: 2,
                  }
                }}
              >
                <Tab
                  label="Geographic View"
                  icon={<Map />}
                  iconPosition="start"
                  id="dashboard-tab-0"
                  aria-controls="dashboard-tabpanel-0"
                />
                <Tab
                  label="Analytics & Charts"
                  icon={<Assessment />}
                  iconPosition="start"
                  id="dashboard-tab-1"
                  aria-controls="dashboard-tabpanel-1"
                />
                <Tab
                  label="Data Explorer"
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
          </Card>
        )}

        {/* Report Section */}
        {predictions.length > 0 && (
          <Card 
            sx={{ 
              mt: 4,
              borderRadius: '16px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                    Report Generation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Export comprehensive analysis reports in multiple formats
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <ReportDownload
                predictions={predictions}
                onReportGenerated={(reportId) => {
                  toast.success('Report generated successfully!');
                }}
              />
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;