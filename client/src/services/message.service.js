import axios from './axios.config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class MessageService {
  // Get conversations for a specific page
  getConversations = async (pageId) => {
    try {
      const response = await axios.get(`${API_URL}/api/messages/conversations?pageId=${pageId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch conversations');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Get messages for a specific conversation
  getMessages = async (conversationId) => {
    try {
      const response = await axios.get(`${API_URL}/api/messages/conversation/${conversationId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch messages');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Send a message in a conversation
  sendMessage = async (conversationId, content) => {
    try {
      const response = await axios.post(`${API_URL}/api/messages/send`, {
        conversationId,
        content
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  // Mark a conversation as read
  markAsRead = async (conversationId) => {
    try {
      const response = await axios.put(`${API_URL}/api/messages/mark-read/${conversationId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to mark conversation as read');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };
}

export default new MessageService(); 