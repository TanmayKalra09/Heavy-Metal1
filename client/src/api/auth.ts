import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authAPI.post('/auth/login', credentials);
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await authAPI.post('/auth/register', userData);
    return response.data;
  },

  // Verify token and get user info
  verifyToken: async (): Promise<User> => {
    const response = await authAPI.get('/auth/verify');
    return response.data.user;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await authAPI.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await authAPI.get('/auth/profile');
    return response.data.user;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await authAPI.put('/auth/profile', userData);
    return response.data.user;
  },
};

export default authService;