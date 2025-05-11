import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import facebookService from '../../services/facebook.service';

const DisconnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectedPage, setConnectedPage] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch connected pages when component mounts
    const fetchConnectedPages = async () => {
      try {
        setLoading(true);
        
        const response = await facebookService.getConnectedPages();
        
        if (response.success && response.pages && response.pages.length > 0) {
          // Just take the first page for simplicity
          setConnectedPage(response.pages[0]);
        }
      } catch (err) {
        console.error('Error fetching connected pages:', err);
        setError('Failed to load connected Facebook pages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnectedPages();
  }, []);
  
  const handleDeleteIntegration = async () => {
    if (!connectedPage) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await facebookService.disconnectPage(connectedPage.pageId);
      
      setSuccess('Successfully disconnected Facebook page');
      setConnectedPage(null);
      
      // Redirect to connect page after short delay
      setTimeout(() => {
        navigate('/connect');
      }, 2000);
    } catch (err) {
      console.error('Error disconnecting page:', err);
      setError(err.message || 'Failed to disconnect page. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReplyToMessages = () => {
    navigate('/dashboard');
  };
  
  if (loading && !connectedPage) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Facebook Page Integration</h2>
          <div className="loading-spinner"></div>
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading connected pages...</p>
        </div>
      </div>
    );
  }
  
  if (!connectedPage && !loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Facebook Page Integration</h2>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            You don't have any Facebook pages connected yet.
          </p>
          
          <button 
            className="btn btn-primary btn-block"
            onClick={() => navigate('/connect')}
          >
            Connect a Facebook Page
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Facebook Page Integration</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}
        
        <div className="page-integration">
          {connectedPage && (
            <>
              <div className="integrated-page">
                Integrated Page: <strong>{connectedPage.pageName}</strong>
              </div>
              
              <div className="page-actions">
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteIntegration}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Integration'}
                </button>
                
                <button 
                  className="btn btn-primary"
                  onClick={handleReplyToMessages}
                  disabled={loading}
                >
                  Reply To Messages
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisconnectPage; 