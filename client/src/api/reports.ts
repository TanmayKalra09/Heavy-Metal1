import axios from 'axios';
import { PredictionResult } from './predict';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ReportConfig {
  title: string;
  description?: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  includeCharts: boolean;
  includeMap: boolean;
  includeRawData: boolean;
  format: 'pdf' | 'excel';
  predictionIds?: string[];
}

export interface ReportSummary {
  id: string;
  title: string;
  description?: string;
  format: 'pdf' | 'excel';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  fileSize?: number;
  samplesCount: number;
  config: ReportConfig;
}

export interface ReportData {
  summary: {
    totalSamples: number;
    safeCount: number;
    cautionCount: number;
    unsafeCount: number;
    averageHMPI: number;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    location?: {
      centerLat: number;
      centerLng: number;
      radius: number;
    };
  };
  predictions: PredictionResult[];
  charts: {
    hmpiDistribution: Array<{ category: string; count: number; percentage: number }>;
    metalConcentrations: Array<{ metal: string; average: number; max: number; min: number }>;
    timeSeriesData: Array<{ date: string; hmpiScore: number; category: string }>;
    locationData: Array<{ lat: number; lng: number; hmpiScore: number; category: string }>;
  };
}

// Create axios instance
const reportsAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
reportsAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reportsService = {
  // Generate a new report
  generateReport: async (config: ReportConfig): Promise<{ reportId: string }> => {
    const response = await reportsAPI.post('/reports/generate', config);
    return response.data;
  },

  // Get all reports for current user
  getAllReports: async (page = 1, limit = 20): Promise<{
    reports: ReportSummary[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await reportsAPI.get('/reports', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get specific report details
  getReport: async (reportId: string): Promise<ReportSummary> => {
    const response = await reportsAPI.get(`/reports/${reportId}`);
    return response.data;
  },

  // Get report data for preview
  getReportData: async (reportId: string): Promise<ReportData> => {
    const response = await reportsAPI.get(`/reports/${reportId}/data`);
    return response.data;
  },

  // Download report file
  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await reportsAPI.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete report
  deleteReport: async (reportId: string): Promise<void> => {
    await reportsAPI.delete(`/reports/${reportId}`);
  },

  // Get report status
  getReportStatus: async (reportId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    message?: string;
  }> => {
    const response = await reportsAPI.get(`/reports/${reportId}/status`);
    return response.data;
  },

  // Generate quick report from prediction IDs
  generateQuickReport: async (
    predictionIds: string[],
    format: 'pdf' | 'excel' = 'pdf',
    title = 'Quick Report'
  ): Promise<{ reportId: string }> => {
    const config: ReportConfig = {
      title,
      predictionIds,
      format,
      includeCharts: true,
      includeMap: true,
      includeRawData: true,
      dateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        endDate: new Date().toISOString(),
      },
    };
    return reportsService.generateReport(config);
  },

  // Export data as CSV
  exportCSV: async (predictionIds: string[]): Promise<Blob> => {
    const response = await reportsAPI.post('/reports/export/csv', 
      { predictionIds },
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Get report templates
  getReportTemplates: async (): Promise<Array<{
    id: string;
    name: string;
    description: string;
    config: Partial<ReportConfig>;
  }>> => {
    const response = await reportsAPI.get('/reports/templates');
    return response.data;
  },

  // Save report template
  saveReportTemplate: async (template: {
    name: string;
    description: string;
    config: Partial<ReportConfig>;
  }): Promise<{ templateId: string }> => {
    const response = await reportsAPI.post('/reports/templates', template);
    return response.data;
  },

  // Schedule recurring report
  scheduleReport: async (config: ReportConfig & {
    schedule: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  }): Promise<{ scheduleId: string }> => {
    const response = await reportsAPI.post('/reports/schedule', config);
    return response.data;
  },

  // Get scheduled reports
  getScheduledReports: async (): Promise<Array<{
    id: string;
    config: ReportConfig;
    schedule: string;
    recipients: string[];
    nextRun: string;
    isActive: boolean;
  }>> => {
    const response = await reportsAPI.get('/reports/scheduled');
    return response.data;
  },

  // Cancel scheduled report
  cancelScheduledReport: async (scheduleId: string): Promise<void> => {
    await reportsAPI.delete(`/reports/scheduled/${scheduleId}`);
  },
};

export default reportsService;