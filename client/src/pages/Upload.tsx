import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Fade,
  Slide,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  Info,
  GetApp,
  Assessment,
  WaterDrop,
  Science,
  LocationOn,
  CalendarToday,
  TrendingUp,
  FileUpload as FileUploadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Define the props interface for the mock component
interface FileUploadProps {
  onUploadComplete: (response: UploadResponse) => void;
  onUploadError: (message: string) => void;
  acceptedFileTypes: string[];
  maxFileSize: number;
  multiple: boolean;
}

// Mock FileUpload component with proper TypeScript props
const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  acceptedFileTypes,
  maxFileSize,
  multiple,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onUploadComplete({
        samplesCount: 150,
        validSamples: 143,
        invalidSamples: 7,
        fileName: 'water_quality_data.csv',
      });
    }, 2000);
  };

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'primary.light',
        borderRadius: 3,
        p: 4,
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05))',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.08))',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
        },
      }}
    >
      {isUploading ? (
        <Box>
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="primary" gutterBottom>
            Processing your data...
          </Typography>
          <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
        </Box>
      ) : (
        <Box>
          <FileUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drop your CSV file here or click to browse
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Supports CSV files up to 50MB
          </Typography>
          <Button
            variant="contained"
            onClick={handleFileUpload}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
              },
            }}
          >
            Select File
          </Button>
        </Box>
      )}
    </Box>
  );
};

interface User {
  id: string;
  name: string;
  email: string;
}

interface UploadResponse {
  samplesCount: number;
  validSamples: number;
  invalidSamples: number;
  fileName: string;
}

interface UploadProps {
  user: User;
}

const Upload: React.FC<UploadProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadResults, setUploadResults] = useState<UploadResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    {
      label: 'Prepare Your Data',
      description: 'Ensure your CSV file contains the required columns',
      icon: <Science />,
    },
    {
      label: 'Upload File',
      description: 'Select and upload your water quality data file',
      icon: <CloudUpload />,
    },
    {
      label: 'Review Results',
      description: 'Check the upload results and proceed to analysis',
      icon: <Assessment />,
    },
  ];

  const requiredColumns = [
    { name: 'latitude', icon: <LocationOn />, color: '#EF4444' },
    { name: 'longitude', icon: <LocationOn />, color: '#EF4444' },
    { name: 'date', icon: <CalendarToday />, color: '#10B981' },
    { name: 'arsenic', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'cadmium', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'chromium', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'lead', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'mercury', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'zinc', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'copper', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'iron', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'manganese', icon: <WaterDrop />, color: '#3B82F6' },
    { name: 'nickel', icon: <WaterDrop />, color: '#3B82F6' },
  ];

  const sampleData = [
    {
      latitude: 28.6139,
      longitude: 77.209,
      date: '2024-01-15',
      arsenic: 0.05,
      cadmium: 0.003,
      chromium: 0.02,
      lead: 0.01,
      mercury: 0.001,
      zinc: 0.5,
      copper: 0.1,
      iron: 0.3,
      manganese: 0.05,
      nickel: 0.02,
    },
  ];

  const handleUploadComplete = (response: UploadResponse) => {
    setUploadResults((prev) => [...prev, response]);
    setActiveStep(2);
    toast.success(`Successfully processed ${response.validSamples} samples!`);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setUploadResults([]);
    setError(null);
  };

  const downloadSampleCSV = () => {
    const csvContent = [
      requiredColumns.map((col) => col.name).join(','),
      Object.values(sampleData[0]).join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_water_quality_data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getTotalResults = () => {
    return uploadResults.reduce(
      (acc, result) => ({
        total: acc.total + result.samplesCount,
        valid: acc.valid + result.validSamples,
        invalid: acc.invalid + result.invalidSamples,
      }),
      { total: 0, valid: 0, invalid: 0 },
    );
  };

  const totals = getTotalResults();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'rgb(248, 250, 252)',
        pt: 10,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                mb: 3,
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
              }}
            >
              <WaterDrop sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1E293B, #475569)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Upload Water Quality Data
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              Upload your water quality datasets for comprehensive heavy metal pollution analysis and insights
            </Typography>
          </Box>
        </Fade>

        {error && (
          <Slide direction="down" in mountOnEnter unmountOnExit>
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Slide>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stepper
                  activeStep={activeStep}
                  orientation="vertical"
                  sx={{
                    '& .MuiStepLabel-root': {
                      py: 1,
                    },
                    '& .MuiStepIcon-root': {
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      '&.Mui-active': {
                        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      },
                      '&.Mui-completed': {
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                      },
                    },
                  }}
                >
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.1rem' }}>
                          {step.description}
                        </Typography>

                        {index === 0 && (
                          <Fade in timeout={600}>
                            <Box>
                              <Alert
                                severity="info"
                                sx={{
                                  mb: 3,
                                  borderRadius: 3,
                                  background:
                                    'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05))',
                                  border: '1px solid rgba(59, 130, 246, 0.2)',
                                }}
                                icon={<Info sx={{ color: '#3B82F6' }} />}
                              >
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                  Required CSV Format
                                </Typography>
                                <Typography variant="body2">
                                  Your CSV file must contain the following columns with metal concentrations in mg/L:
                                </Typography>
                              </Alert>

                              <Card
                                variant="outlined"
                                sx={{
                                  mb: 3,
                                  borderRadius: 3,
                                  background:
                                    'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8))',
                                  border: '1px solid rgba(59, 130, 246, 0.1)',
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                    Required Columns:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                    {requiredColumns.map((column) => (
                                      <Chip
                                        key={column.name}
                                        label={column.name}
                                        size="medium"
                                        icon={React.cloneElement(column.icon, { sx: { fontSize: 18 } })}
                                        sx={{
                                          borderRadius: 2,
                                          backgroundColor: `${column.color}15`,
                                          color: column.color,
                                          border: `1px solid ${column.color}30`,
                                          fontWeight: 500,
                                          '&:hover': {
                                            backgroundColor: `${column.color}25`,
                                            transform: 'translateY(-1px)',
                                          },
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </CardContent>
                              </Card>

                              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<GetApp />}
                                  onClick={downloadSampleCSV}
                                  sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    borderColor: 'primary.main',
                                    '&:hover': {
                                      background:
                                        'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05))',
                                      borderColor: 'primary.dark',
                                      transform: 'translateY(-1px)',
                                    },
                                  }}
                                >
                                  Download Sample CSV
                                </Button>
                              </Box>

                              <Box sx={{ mt: 3 }}>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  size="large"
                                  sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                                    },
                                  }}
                                >
                                  Continue to Upload
                                </Button>
                              </Box>
                            </Box>
                          </Fade>
                        )}

                        {index === 1 && (
                          <Fade in timeout={600}>
                            <Box>
                              <FileUpload
                                onUploadComplete={handleUploadComplete}
                                onUploadError={handleUploadError}
                                acceptedFileTypes={['.csv']}
                                maxFileSize={50 * 1024 * 1024}
                                multiple={true}
                              />

                              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                  onClick={handleBack}
                                  sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                  }}
                                >
                                  Back
                                </Button>
                                {uploadResults.length > 0 && (
                                  <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{
                                      borderRadius: 2,
                                      px: 4,
                                      py: 1.5,
                                      background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                                      },
                                    }}
                                  >
                                    Review Results
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          </Fade>
                        )}

                        {index === 2 && (
                          <Fade in timeout={600}>
                            <Box>
                              {uploadResults.length > 0 ? (
                                <Box>
                                  <Alert
                                    severity="success"
                                    sx={{
                                      mb: 3,
                                      borderRadius: 3,
                                      background:
                                        'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))',
                                      border: '1px solid rgba(16, 185, 129, 0.2)',
                                    }}
                                  >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      Upload Completed Successfully!
                                    </Typography>
                                    <Typography variant="body2">
                                      {totals.valid} valid samples processed from {totals.total} total samples
                                    </Typography>
                                  </Alert>

                                  <Card
                                    variant="outlined"
                                    sx={{
                                      mb: 3,
                                      borderRadius: 3,
                                      background:
                                        'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8))',
                                      border: '1px solid rgba(59, 130, 246, 0.1)',
                                    }}
                                  >
                                    <CardContent sx={{ p: 3 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                          Upload Summary
                                        </Typography>
                                      </Box>
                                      <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                          <Box
                                            sx={{
                                              textAlign: 'center',
                                              p: 2,
                                              borderRadius: 2,
                                              background:
                                                'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05))',
                                            }}
                                          >
                                            <Typography
                                              variant="h3"
                                              sx={{
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                              }}
                                            >
                                              {totals.total}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                              Total Samples
                                            </Typography>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Box
                                            sx={{
                                              textAlign: 'center',
                                              p: 2,
                                              borderRadius: 2,
                                              background:
                                                'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))',
                                            }}
                                          >
                                            <Typography
                                              variant="h3"
                                              sx={{
                                                fontWeight: 700,
                                                color: 'success.main',
                                              }}
                                            >
                                              {totals.valid}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                              Valid Samples
                                            </Typography>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Box
                                            sx={{
                                              textAlign: 'center',
                                              p: 2,
                                              borderRadius: 2,
                                              background:
                                                'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))',
                                            }}
                                          >
                                            <Typography
                                              variant="h3"
                                              sx={{
                                                fontWeight: 700,
                                                color: 'error.main',
                                              }}
                                            >
                                              {totals.invalid}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                              Invalid Samples
                                            </Typography>
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </CardContent>
                                  </Card>

                                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <Button
                                      variant="contained"
                                      startIcon={<Assessment />}
                                      onClick={() => navigate('/dashboard')}
                                      size="large"
                                      sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                                        },
                                      }}
                                    >
                                      View Analysis Dashboard
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      onClick={handleReset}
                                      size="large"
                                      sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                          background:
                                            'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05))',
                                          borderColor: 'primary.dark',
                                        },
                                      }}
                                    >
                                      Upload More Data
                                    </Button>
                                  </Box>
                                </Box>
                              ) : (
                                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                                  No successful uploads to review. Please go back and upload your data.
                                </Alert>
                              )}

                              <Box sx={{ mt: 3 }}>
                                <Button
                                  onClick={handleBack}
                                  sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                  }}
                                >
                                  Back
                                </Button>
                              </Box>
                            </Box>
                          </Fade>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: '#FFFFFF',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Data Requirements
                      </Typography>
                    </Box>
                    <List dense>
                      {[
                        { primary: 'CSV Format', secondary: 'Comma-separated values file', icon: <CheckCircle color="success" /> },
                        {
                          primary: 'Geographic Coordinates',
                          secondary: 'Latitude and longitude in decimal degrees',
                          icon: <LocationOn color="primary" />,
                        },
                        {
                          primary: 'Metal Concentrations',
                          secondary: 'Values in mg/L (milligrams per liter)',
                          icon: <WaterDrop color="primary" />,
                        },
                        {
                          primary: 'Date Information',
                          secondary: 'Sample collection date (YYYY-MM-DD)',
                          icon: <CalendarToday color="primary" />,
                        },
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': {
                              background: 'rgba(59, 130, 246, 0.05)',
                            },
                          }}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{item.primary}</Typography>}
                            secondary={item.secondary}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: '#ffffff',
                    border: '1px solid rgba(16, 185, 129, 0.1)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Info sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Need Help?
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: '1rem' }}>
                      If you're having trouble with the upload process or data format, here are some helpful resources:
                    </Typography>
                    <List dense>
                      {[
                        { primary: 'Sample Data', secondary: 'Download our sample CSV file as a template' },
                        { primary: 'Data Validation', secondary: 'Check for missing values and correct formats' },
                        { primary: 'File Size Limit', secondary: 'Maximum file size is 50MB' },
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': {
                              background: 'rgba(16, 185, 129, 0.05)',
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Info color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{item.primary}</Typography>}
                            secondary={item.secondary}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Upload;