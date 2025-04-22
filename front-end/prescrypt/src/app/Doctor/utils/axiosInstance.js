import axios from 'axios';

// axios instance 
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5213/api', //backend API URL
    headers: {
      'Content-Type': 'application/json',
      
    },
  });
  
export default axiosInstance;