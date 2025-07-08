import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unknown error occurred';
    // Only show toast for server errors (not validation errors)
    if (
      !(
        message.toLowerCase().includes('valid email address') ||
        message.toLowerCase().includes('valid user') ||
        message.toLowerCase().includes('email is required')
      )
    ) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default apiClient; 