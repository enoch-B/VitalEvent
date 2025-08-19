import axios from 'axios';

// API base URL
const API_BASE_URL ='http://localhost:5001/api/v1';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// -------------------- Auth API --------------------
export const authAPI = {
  login: (credentials: { email: string; password: string; role?: string }) =>
    api.post('auth/login', credentials),

  register: (userData: any) =>
    api.post('auth/register', userData),

  refreshToken: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('auth/refresh', { refreshToken });
  },

  logout: () =>
    api.post('/auth/logout'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('auth/change-password', data),
};

// -------------------- Users API --------------------
export const usersAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (userData: any) => api.post('/users', userData),
  update: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
};

// -------------------- Institutions API --------------------
export const institutionsAPI = {
  getAll: (params?: any) => api.get('/institutions', { params }),
  getById: (id: string) => api.get(`/institutions/${id}`),
  create: (institutionData: any) => api.post('/institutions', institutionData),
  update: (id: string, institutionData: any) => api.put(`/institutions/${id}`, institutionData),
  delete: (id: string) => api.delete(`/institutions/${id}`),
};

// -------------------- Records API --------------------
export const recordsAPI = {
  getAll: (params?: any) => api.get('/records', { params }),
  getById: (id: string) => api.get(`/records/${id}`),
  create: (recordData: any) => api.post('/records', recordData),
  update: (id: string, recordData: any) => api.put(`/records/${id}`, recordData),
  delete: (id: string) => api.delete(`/records/${id}`),
  getByType: (type: string, params?: any) => api.get(`/records/type/${type}`, { params }),
  getByInstitution: (institutionId: string, params?: any) =>
    api.get(`/records/institution/${institutionId}`, { params }),
};

// -------------------- AI API --------------------
export const aiAPI = {
  analyzeDocument: (file: File, options?: any) => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) formData.append('options', JSON.stringify(options));
    return api.post('/ai/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  extractText: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/ai/ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  detectFraud: (data: any) => api.post('/ai/fraud-detection', data),
  classifyRecord: (data: any) => api.post('/ai/classification', data),
  validateData: (data: any) => api.post('/ai/validation', data),
  getAnalysisHistory: (recordId: string) => api.get(`/ai/analysis/${recordId}`),
};

// -------------------- Analytics API --------------------
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getRecordsByType: (params?: any) => api.get('/analytics/records-by-type', { params }),
  getRecordsByInstitution: (params?: any) => api.get('/analytics/records-by-institution', { params }),
  getRecordsByDate: (params?: any) => api.get('/analytics/records-by-date', { params }),
  getAIUsageStats: (params?: any) => api.get('/analytics/ai-usage', { params }),
};

// -------------------- Reports API --------------------
export const reportsAPI = {
  generateReport: (params: any) => api.post('/reports/generate', params),
  getReportHistory: (params?: any) => api.get('/reports/history', { params }),
  downloadReport: (reportId: string) => api.get(`/reports/${reportId}/download`),
};

export default api;
