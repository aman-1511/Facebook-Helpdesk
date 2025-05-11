import React from 'react';

const CustomerProfile = ({ customer }) => {
  if (!customer) {
    return (
      <div className="profile-panel">
        <div className="profile-header">Customer Details</div>
        <p style={{ textAlign: 'center', color: '#65676b' }}>
          Select a conversation to view customer details
        </p>
      </div>
    );
  }
  
  return (
    <div className="profile-panel">
      <div className="profile-header">Customer details</div>
      
      <div className="profile-detail">
        <div className="profile-label">Email</div>
        <div className="profile-value">{customer.email || 'Not available'}</div>
      </div>
      
      <div className="profile-detail">
        <div className="profile-label">First Name</div>
        <div className="profile-value">{customer.firstName || customer.name?.split(' ')[0] || 'Not available'}</div>
      </div>
      
      <div className="profile-detail">
        <div className="profile-label">Last Name</div>
        <div className="profile-value">
          {customer.lastName || 
           (customer.name && customer.name.split(' ').length > 1 
            ? customer.name.split(' ').slice(1).join(' ') 
            : 'Not available')}
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="#" className="profile-view-more" style={{ 
          fontSize: '0.9rem', 
          color: 'var(--primary-color)',
          textDecoration: 'none'
        }}>
          View more details
        </a>
      </div>
    </div>
  );
};

export default CustomerProfile; 