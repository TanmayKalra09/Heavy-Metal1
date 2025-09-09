import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
} from '@mui/material';
import {
  GetApp,
  PictureAsPdf,
  TableChart,
  Close,
  Download,
  Schedule,
  Delete,
} from '@mui/icons-material';
// Date picker imports removed - not currently used in this component
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { reportsService, ReportConfig, ReportSummary } from '../api/reports';
import { PredictionResult } from '../api/predict';

interface ReportDownloadProps {
  predictions: PredictionResult[];
  selectedPredictions?: PredictionResult[];
  onReportGenerated?: (reportId: string) => void;
}

const ReportDownload: React.FC<ReportDownloadProps> = ({
  predictions,
  selectedPredictions = [],
  onReportGenerated,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    title: 'Water Quality Analysis Report',
    description: '',
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
    },
    includeCharts: true,
    includeMap: true,
    includeRawData: true,
    format: 'pdf',
  });

  const handleOpen = async () => {
    setOpen(true);
    await loadReports();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const response = await reportsService.getAllReports(1, 10);
      setReports(response.reports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const reportConfig: ReportConfig = {
        ...config,
        predictionIds: selectedPredictions.length > 0 
          ? selectedPredictions.map((p: PredictionResult) => p.id)
          : predictions.map((p: PredictionResult) => p.id),
      };

      const response = await reportsService.generateReport(reportConfig);
      onReportGenerated?.(response.reportId);
      
      // Refresh reports list
      await loadReports();
      
      // Reset form
      setConfig({
        ...config,
        title: 'Water Quality Analysis Report',
        description: '',
      });
    } catch (error: any) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const blob = await reportsService.downloadReport(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.${config.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await reportsService.deleteReport(reportId);
      await loadReports();
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleQuickDownload = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    try {
      const predictionIds = selectedPredictions.length > 0 
        ? selectedPredictions.map((p: PredictionResult) => p.id)
        : predictions.slice(0, 10).map(p => p.id); // Limit to first 10 for quick download

      const response = await reportsService.generateQuickReport(
        predictionIds,
        format,
        `Quick Report - ${new Date().toLocaleDateString()}`
      );

      // Wait a moment for report generation
      setTimeout(async () => {
        try {
          await handleDownloadReport(response.reportId);
        } catch (error) {
          console.error('Error in quick download:', error);
        }
      }, 2000);

    } catch (error) {
      console.error('Error in quick download:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ReportSummary['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<GetApp />}
          onClick={handleOpen}
          disabled={predictions.length === 0}
        >
          Generate Report
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<PictureAsPdf />}
          onClick={() => handleQuickDownload('pdf')}
          disabled={predictions.length === 0 || loading}
        >
          Quick PDF
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<TableChart />}
          onClick={() => handleQuickDownload('excel')}
          disabled={predictions.length === 0 || loading}
        >
          Quick Excel
        </Button>
      </Box>

      {predictions.length === 0 && (
        <Alert severity="info">
          No data available for report generation. Upload water quality data first.
        </Alert>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Generate Report
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Report Title"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Format</InputLabel>
                <Select
                  value={config.format}
                  label="Format"
                  onChange={(e) => setConfig({ ...config, format: e.target.value as 'pdf' | 'excel' })}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Include in Report:
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.includeCharts}
                    onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
                  />
                }
                label="Charts and Graphs"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.includeMap}
                    onChange={(e) => setConfig({ ...config, includeMap: e.target.checked })}
                  />
                }
                label="Location Map"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.includeRawData}
                    onChange={(e) => setConfig({ ...config, includeRawData: e.target.checked })}
                  />
                }
                label="Raw Data Tables"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Data Selection:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedPredictions.length > 0 
                  ? `${selectedPredictions.length} selected samples`
                  : `All ${predictions.length} samples`
                }
              </Typography>
            </Grid>
          </Grid>
          
          {/* Recent Reports */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Reports
            </Typography>
            
            {loadingReports ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {reports.map((report) => (
                  <ListItem key={report.id} divider>
                    <ListItemIcon>
                      {report.format === 'pdf' ? <PictureAsPdf /> : <TableChart />}
                    </ListItemIcon>
                    <ListItemText
                      primary={report.title}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            Created: {new Date(report.createdAt).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Samples: {report.samplesCount} | Size: {formatFileSize(report.fileSize)}
                          </Typography>
                          <Chip
                            label={report.status}
                            size="small"
                            color={getStatusColor(report.status) as any}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                    <Box>
                      {report.status === 'completed' && (
                        <IconButton
                          onClick={() => handleDownloadReport(report.id)}
                          color="primary"
                        >
                          <Download />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => handleDeleteReport(report.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
                
                {reports.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No reports generated yet"
                      secondary="Generate your first report to see it here"
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleGenerateReport}
            variant="contained"
            disabled={loading || !config.title.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <GetApp />}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportDownload;