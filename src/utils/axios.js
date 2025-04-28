import axios from 'axios';


// Create axios instance with base URL
const instance = axios.create({
  baseURL: 'https://shikhbo-backend.onrender.com/api',
  withCredentials: true // Important for cookies
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';
    
console.log("error in axios code",error)
      return Promise.reject(error);
  }
);

export default instance;