import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface WaterSample {
  id?: string;
  latitude: number;
  longitude: number;
  date: string;
  arsenic?: number;
  cadmium?: number;
  chromium?: number;
  lead?: number;
  mercury?: number;
  zinc?: number;
  copper?: number;
  iron?: number;
  manganese?: number;
  nickel?: number;
}

export interface PredictionResult {
  id: string;
  sampleId: string;
  hmpiScore: number;
  riskCategory: 'safe' | 'caution' | 'unsafe';
  metalConcentrations: Record<string, number>;
  location: {
    latitude: number;
    longitude: number;
  };
  date: string;
  createdAt: string;
}

export interface BatchPredictionResult {
  results: PredictionResult[];
  summary: {
    totalSamples: number;
    safeCount: number;
    cautionCount: number;
    unsafeCount: number;
    averageHMPI: number;
  };
}

export interface UploadResponse {
  message: string;
  uploadId: string;
  samplesCount: number;
  validSamples: number;
  invalidSamples: number;
  errors?: string[];
}

// Create axios instance
const predictAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
predictAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const predictService = {
  // Upload CSV file with water samples
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await predictAPI.post('/predict/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Predict HMPI for a single sample
  predictSingle: async (sample: WaterSample): Promise<PredictionResult> => {
    const response = await predictAPI.post('/predict/single', sample);
    return response.data;
  },

  // Get batch prediction results
  getBatchResults: async (uploadId: string): Promise<BatchPredictionResult> => {
    const response = await predictAPI.get(`/predict/batch/${uploadId}`);
    return response.data;
  },

  // Get all predictions for current user
  getAllPredictions: async (page = 1, limit = 50): Promise<{
    predictions: PredictionResult[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await predictAPI.get('/predict/all', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get predictions by location (within radius)
  getPredictionsByLocation: async (
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<PredictionResult[]> => {
    const response = await predictAPI.get('/predict/location', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },

  // Get predictions by date range
  getPredictionsByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<PredictionResult[]> => {
    const response = await predictAPI.get('/predict/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Delete prediction
  deletePrediction: async (predictionId: string): Promise<void> => {
    await predictAPI.delete(`/predict/${predictionId}`);
  },

  // Get prediction statistics
  getStatistics: async (): Promise<{
    totalPredictions: number;
    safePercentage: number;
    cautionPercentage: number;
    unsafePercentage: number;
    averageHMPI: number;
    recentPredictions: PredictionResult[];
  }> => {
    const response = await predictAPI.get('/predict/statistics');
    return response.data;
  },

  // Real-time prediction (WebSocket or polling)
  subscribeToRealTimePredictions: (callback: (prediction: PredictionResult) => void) => {
    // This would implement WebSocket connection for real-time updates
    // For now, we'll use polling as a fallback
    const pollInterval = setInterval(async () => {
      try {
        const response = await predictAPI.get('/predict/latest');
        if (response.data) {
          callback(response.data);
        }
      } catch (error) {
        console.error('Error polling for updates:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  },
};

export default predictService;