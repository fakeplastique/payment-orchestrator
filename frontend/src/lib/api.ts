import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Response interceptor: handle 401 with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
              { refreshToken },
            );
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  signup: (email: string, password: string, companyName: string) =>
    api.post('/auth/signup', { email, password, companyName }).then((r) => r.data),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then((r) => r.data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }).then((r) => r.data),
  getProfile: () => api.get('/auth/profile').then((r) => r.data),
  inviteUser: (data: { email: string; password: string; role: string }) =>
    api.post('/auth/invite', data).then((r) => r.data),
};

export const dashboardApi = {
  getStats: (days = 30) =>
    api.get(`/dashboard/stats?days=${days}`).then((r) => r.data),
};

export const transactionsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/transactions', { params }).then((r) => r.data),
  getOne: (id: string) =>
    api.get(`/transactions/${id}`).then((r) => r.data),
};

export const companiesApi = {
  getMine: () => api.get('/companies/mine').then((r) => r.data),
};

export const usersApi = {
  getAll: () => api.get('/users').then((r) => r.data),
};

export const integrationsApi = {
  getAll: () => api.get('/integrations').then((r) => r.data),
};

export const fraudChecksApi = {
  getAll: () => api.get('/fraud-checks').then((r) => r.data),
};
