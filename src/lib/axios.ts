import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authEndpoints = ['/auth/login', '/auth/register'];

      const isAuthEndpoint = authEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (!isAuthEndpoint) {
        const token = localStorage.getItem('access_token');

        if (!token) {
          window.location.href = '/';
          return Promise.reject(new Error('No access token found'));
        }

        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
