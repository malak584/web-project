import api from '../../config/axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // updated port to 5001
  withCredentials: true, // if you're using cookies for auth
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
