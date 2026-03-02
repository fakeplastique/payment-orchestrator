import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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
  getAll: () => api.get('/companies').then((r) => r.data),
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
