// utils/axiosConfig.js
import axios from 'axios';

let logoutCallback = null;

export const setupAxiosInterceptors = (onLogout) => {
  logoutCallback = onLogout;
  
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        // Check if token is expired before making request
        if (isTokenExpired(token)) {
          logoutCallback();
          return Promise.reject(new Error('Token expired'));
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token invalid or expired
        logoutCallback();
      }
      return Promise.reject(error);
    }
  );
};

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};