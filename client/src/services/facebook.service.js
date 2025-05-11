import axios from './axios.config';

const FB_APP_ID = process.env.REACT_APP_FB_APP_ID || '1234567890';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class FacebookService {
  // Initialize Facebook SDK
  initFacebookSDK = () => {
    return new Promise((resolve, reject) => {
      // Check if FB is already loaded
      if (window.FB) {
        console.log('Facebook SDK already loaded');
        resolve(window.FB);
        return;
      }

      // Load SDK asynchronously
      const script = document.createElement('script');
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.id = 'facebook-jssdk';
      
      // Error handling for script loading
      script.onerror = () => {
        reject(new Error('Failed to load Facebook SDK script'));
      };
      
      // Success callback
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: FB_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        
        console.log('Facebook SDK initialized successfully');
        resolve(window.FB);
      };
      
      // Add script to document
      document.body.appendChild(script);
    });
  };
  
  // Login with Facebook and get pages
  loginWithFacebook = () => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK not initialized. Please refresh the page and try again.'));
        return;
      }
      
      window.FB.login((response) => {
        if (response.authResponse) {
          // Get short-lived user access token
          const accessToken = response.authResponse.accessToken;
          
          // Exchange for long-lived token and get pages
          this.exchangeToken(accessToken)
            .then(result => resolve(result))
            .catch(error => reject(error));
        } else {
          reject(new Error('Facebook login was cancelled or failed'));
        }
      }, { scope: 'pages_show_list,pages_messaging,pages_read_engagement,email' });
    });
  };
  
  // Exchange short-lived token for long-lived token and get pages
  exchangeToken = async (shortLivedToken) => {
    try {
      const response = await axios.post(`${API_URL}/api/facebook/exchange-token`, {
        accessToken: shortLivedToken
      });
      
      if (response.data.success) {
        return response.data.pages;
      } else {
        throw new Error(response.data.message || 'Failed to exchange token');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Connect a Facebook page to the helpdesk
  connectPage = async (pageData) => {
    try {
      const response = await axios.post(`${API_URL}/api/facebook/connect-page`, pageData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to connect page');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Get all connected Facebook pages
  getConnectedPages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/facebook/pages`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch connected pages');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Disconnect a Facebook page
  disconnectPage = async (pageId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/facebook/disconnect-page/${pageId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to disconnect page');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
}

export default new FacebookService(); 