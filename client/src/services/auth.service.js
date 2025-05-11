import axios from './axios.config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const USER_KEY = 'fb_helpdesk_user';

class AuthService {
  // Register a new user
  register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      
      if (response.data.success && response.data.user && response.data.token) {
        this.setCurrentUser(response.data.user, response.data.token);
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Login user
  login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      if (response.data.success && response.data.user && response.data.token) {
        this.setCurrentUser(response.data.user, response.data.token);
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Logout user
  logout = () => {
    localStorage.removeItem(USER_KEY);
  };
  
  // Store user in localStorage
  setCurrentUser = (user, token) => {
    user.token = token;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };
  
  // Get current user from localStorage
  getCurrentUser = () => {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  };
  
  // Get current user profile from server
  getUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/profile`);
      
      if (response.data.success && response.data.user) {
        // Update stored user data with latest info
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          this.setCurrentUser({
            ...response.data.user,
          }, currentUser.token);
        }
        
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user profile');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Check if token is valid
  isTokenValid = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/validate-token`);
      return response.data.success;
    } catch (error) {
      this.logout(); // Clear invalid token
      return false;
    }
  };
}

export default new AuthService(); 