import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to all requests
instance.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('fb_helpdesk_user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // If it's not a login or register request and not already retrying
      if (
        !originalRequest.url.includes('/auth/login') && 
        !originalRequest.url.includes('/auth/register') && 
        !originalRequest._retry
      ) {
        // Clear user data and redirect to login
        localStorage.removeItem('fb_helpdesk_user');
        window.location.href = '/login';
      }
    }
    
    // Format error message from server response
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Something went wrong';
    
    const enhancedError = new Error(errorMessage);
    enhancedError.response = error.response;
    enhancedError.status = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

export default instance; 