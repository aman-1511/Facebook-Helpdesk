import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import facebookService from '../../services/facebook.service';

const ConnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fbInitialized, setFbInitialized] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize Facebook SDK when component mounts
    const initFacebook = async () => {
      try {
        await facebookService.initFacebookSDK();
        setFbInitialized(true);
      } catch (err) {
        console.error('Failed to initialize Facebook SDK:', err);
        setError('Failed to initialize Facebook SDK. Please try again later.');
      }
    };
    
    initFacebook();
  }, []);
  
  const handleConnectPage = () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    facebookService.loginWithFacebook()
      .then((result) => {
        if (result && result.length > 0) {
          // Take the first page for simplicity
          const page = result[0];
          
          return facebookService.connectPage({
            pageId: page.id,
            pageName: page.name,
            pageAccessToken: page.access_token
          });
        } else {
          throw new Error('No Facebook pages found to connect');
        }
      })
      .then(() => {
        setSuccess('Successfully connected Facebook page');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      })
      .catch((err) => {
        console.error('Facebook connection error:', err);
        setError(err.message || 'Failed to connect Facebook page. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
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
          <div className="page-integration-title">
            Connect your Facebook Page
          </div>
          
          <p>Integrate your Facebook page with our helpdesk to manage all your customer messages in one place.</p>
          
          <button 
            className="btn btn-primary"
            onClick={handleConnectPage}
            disabled={loading || !fbInitialized}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Connecting...' : 'Connect Page'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage; 