import axios, { type InternalAxiosRequestConfig } from 'axios';

// 1. Create the instance with your backend URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// 2. Add a request interceptor
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    // If a token exists, add it to the Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;