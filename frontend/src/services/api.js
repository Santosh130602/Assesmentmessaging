import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

// ─── Axios Instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach token ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 / refresh token ───────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = res.data.data;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.patch('/auth/change-password', data),
};

// ─── Papers API ──────────────────────────────────────────────────────────────
export const papersAPI = {
  getAll: (params = {}) => api.get('/papers', { params }),
  getById: (id) => api.get(`/papers/${id}`),
  create: (data) => api.post('/papers', data),
  update: (id, data) => api.patch(`/papers/${id}`, data),
  delete: (id) => api.delete(`/papers/${id}`),
};

// ─── Analytics API ───────────────────────────────────────────────────────────
export const analyticsAPI = {
  getAll: () => api.get('/analytics'),
  getFunnel: () => api.get('/analytics/funnel'),
  getScatter: () => api.get('/analytics/scatter'),
  getDomainMatrix: () => api.get('/analytics/domain-matrix'),
  getSummary: () => api.get('/analytics/summary'),
};

export default api;
