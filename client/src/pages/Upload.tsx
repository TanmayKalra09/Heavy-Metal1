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
  Divider,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  Info,
  GetApp,
  Visibility,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileUpload from '../components/FileUpload';
import { UploadResponse } from '../api/predict';

interface User {
  id: string;
  name: string;
  email: string;
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
    },
    {
      label: 'Upload File',
      description: 'Select and upload your water quality data file',
    },
    {
      label: 'Review Results',
      description: 'Check the upload results and proceed to analysis',
    },
  ];

  const requiredColumns = [
    'latitude',
    'longitude',
    'date',
    'arsenic',
    'cadmium',
    'chromium',
    'lead',
    'mercury',
    'zinc',
    'copper',
    'iron',
    'manganese',
    'nickel',
  ];

  const sampleData = [
    {
      latitude: 28.6139,
      longitude: 77.2090,
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
    setUploadResults(prev => [...prev, response]);
    setActiveStep(2);
    toast.success(`Successfully processed ${response.validSamples} samples!`);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setUploadResults([]);
    setError(null);
  };

  const downloadSampleCSV = () => {
    const csvContent = [
      requiredColumns.join(','),
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
    return uploadResults.reduce((acc, result) => ({
      total: acc.total + result.samplesCount,
      valid: acc.valid + result.validSamples,
      invalid: acc.invalid + result.invalidSamples,
    }), { total: 0, valid: 0, invalid: 0 });
  };

  const totals = getTotalResults();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Water Quality Data
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload your water quality datasets for heavy metal pollution analysis
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>

                    {index === 0 && (
                      <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Required CSV Format
                          </Typography>
                          <Typography variant="body2">
                            Your CSV file must contain the following columns with metal concentrations in mg/L:
                          </Typography>
                        </Alert>

                        <Card variant="outlined" sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              Required Columns:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {requiredColumns.map((column) => (
                                <Chip key={column} label={column} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<GetApp />}
                            onClick={downloadSampleCSV}
                          >
                            Download Sample CSV
                          </Button>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <Button variant="contained" onClick={handleNext}>
                            Continue
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {index === 1 && (
                      <Box>
                        <FileUpload
                          onUploadComplete={handleUploadComplete}
                          onUploadError={handleUploadError}
                          acceptedFileTypes={['.csv']}
                          maxFileSize={50 * 1024 * 1024} // 50MB
                          multiple={true}
                        />

                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          <Button onClick={handleBack}>
                            Back
                          </Button>
                          {uploadResults.length > 0 && (
                            <Button variant="contained" onClick={handleNext}>
                              Review Results
                            </Button>
                          )}
                        </Box>
                      </Box>
                    )}

                    {index === 2 && (
                      <Box>
                        {uploadResults.length > 0 ? (
                          <Box>
                            <Alert severity="success" sx={{ mb: 2 }}>
                              <Typography variant="subtitle2">
                                Upload Completed Successfully!
                              </Typography>
                              <Typography variant="body2">
                                {totals.valid} valid samples processed from {totals.total} total samples
                              </Typography>
                            </Alert>

                            <Card variant="outlined" sx={{ mb: 2 }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Upload Summary
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="h4" color="primary">
                                        {totals.total}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Total Samples
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="h4" color="success.main">
                                        {totals.valid}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Valid Samples
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="h4" color="error.main">
                                        {totals.invalid}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
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
                              >
                                View Analysis
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={handleReset}
                              >
                                Upload More Data
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Alert severity="warning">
                            No successful uploads to review. Please go back and upload your data.
                          </Alert>
                        )}

                        <Box sx={{ mt: 2 }}>
                          <Button onClick={handleBack}>
                            Back
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data Requirements
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="CSV Format"
                  secondary="Comma-separated values file"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Geographic Coordinates"
                  secondary="Latitude and longitude in decimal degrees"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Metal Concentrations"
                  secondary="Values in mg/L (milligrams per liter)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Date Information"
                  secondary="Sample collection date (YYYY-MM-DD)"
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              If you're having trouble with the upload process or data format, here are some resources:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Info color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Sample Data"
                  secondary="Download our sample CSV file as a template"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Info color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Data Validation"
                  secondary="Check for missing values and correct formats"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Info color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="File Size Limit"
                  secondary="Maximum file size is 50MB"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Upload;