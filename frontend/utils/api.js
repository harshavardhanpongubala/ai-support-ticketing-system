// API Setup - For talking to backend
import axios from 'axios';

// Backend URL
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Before every request, add login token (if exists)
api.interceptors.request.use((config) => {
  // Get token from browser storage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;