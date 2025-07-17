import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7021/api',
  withCredentials: true, // Important for cookies/auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
axiosInstance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    // Handle unauthorized
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default axiosInstance;