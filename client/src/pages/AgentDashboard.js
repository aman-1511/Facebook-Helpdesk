import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import ConversationList from '../components/Agent/ConversationList';
import MessageThread from '../components/Agent/MessageThread';
import CustomerProfile from '../components/Agent/CustomerProfile';
import facebookService from '../services/facebook.service';
import messageService from '../services/message.service';
import authService from '../services/auth.service';

const AgentDashboard = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  
  const navigate = useNavigate();
  
  // Initialize socket connection
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Connect to socket server with token-based authentication
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const newSocket = io(API_URL, {
      auth: {
        token: user.token
      }
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });
    
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
    
    newSocket.on('new_message', ({ conversation, message }) => {
      console.log('Received new message:', message);
      
      // Add new message to state if it belongs to the current conversation
      if (selectedConversation && conversation._id === selectedConversation._id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
      
      // Update conversations list
      setConversations(prevConversations => {
        const existingIndex = prevConversations.findIndex(c => c._id === conversation._id);
        
        if (existingIndex >= 0) {
          // Update existing conversation
          const updatedConversations = [...prevConversations];
          updatedConversations[existingIndex] = {
            ...updatedConversations[existingIndex],
            lastMessageTimestamp: conversation.lastMessageTimestamp,
            lastMessage: message
          };
          return updatedConversations;
        } else {
          // Add new conversation
          return [conversation, ...prevConversations];
        }
      });
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [navigate, selectedConversation]);
  
  // Fetch connected Facebook pages
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoadingPages(true);
        setError('');
        
        const response = await facebookService.getConnectedPages();
        
        if (response.success && response.pages) {
          setPages(response.pages);
          
          // If pages exist, select the first one by default
          if (response.pages.length > 0) {
            setSelectedPage(response.pages[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching pages:', err);
        setError('Failed to load your connected Facebook pages');
      } finally {
        setLoadingPages(false);
      }
    };
    
    fetchPages();
  }, []);
  
  // Fetch conversations when a page is selected
  useEffect(() => {
    if (!selectedPage) return;
    
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        setError('');
        
        const response = await messageService.getConversations(selectedPage.pageId);
        
        if (response.success && response.conversations) {
          setConversations(response.conversations);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoadingConversations(false);
      }
    };
    
    fetchConversations();
  }, [selectedPage]);
  
  // Handle conversation selection
  const handleSelectConversation = async (conversationId) => {
    try {
      setLoadingMessages(true);
      setError('');
      
      const selectedConv = conversations.find(c => c._id === conversationId);
      setSelectedConversation(selectedConv);
      
      const response = await messageService.getMessages(conversationId);
      
      if (response.success) {
        setMessages(response.messages || []);
      }
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (content) => {
    if (!selectedConversation) return;
    
    try {
      setError('');
      
      const response = await messageService.sendMessage(
        selectedConversation._id, 
        content
      );
      
      if (response.success && response.message) {
        // Add sent message to the messages list
        setMessages(prevMessages => [...prevMessages, response.message]);
        
        // Update the conversation's last message timestamp
        setConversations(prevConversations => {
          return prevConversations.map(conv => {
            if (conv._id === selectedConversation._id) {
              return {
                ...conv,
                lastMessageTimestamp: new Date().toISOString(),
                lastMessage: response.message
              };
            }
            return conv;
          });
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  const handleManagePages = () => {
    navigate('/disconnect');
  };
  
  // If no pages are connected, redirect to connect page
  if (!loadingPages && pages.length === 0) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ 
          maxWidth: '500px', 
          padding: '20px', 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '20px' }}>No Pages Connected</h2>
          <p style={{ marginBottom: '20px' }}>
            You don't have any Facebook pages connected yet. Connect a page to start managing conversations.
          </p>
          <button 
            className="btn btn-primary btn-block"
            onClick={() => navigate('/connect')}
          >
            Connect Facebook Page
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-icon active">
          <i className="fas fa-comments"></i>
        </div>
        <div className="sidebar-icon" onClick={handleManagePages}>
          <i className="fas fa-cog"></i>
        </div>
        <div className="sidebar-icon" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>
      
      {/* Conversation List */}
      <ConversationList 
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedConversation?._id}
        loading={loadingConversations}
      />
      
      {/* Message Thread */}
      <MessageThread 
        conversation={selectedConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loadingMessages}
      />
      
      {/* Customer Profile */}
      <CustomerProfile 
        customer={selectedConversation?.customer}
      />
      
      {/* Error display */}
      {error && (
        <div className="error-toast" style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--danger-color)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard; 