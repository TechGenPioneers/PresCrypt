import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7021/api', // Your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Only run this in the browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (token expired, invalid, etc.)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        window.location.href = '/auth/login?role=doctor';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;