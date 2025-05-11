import React from 'react';

const ConversationList = ({ 
  conversations, 
  onSelectConversation, 
  selectedConversationId,
  loading
}) => {
  if (loading) {
    return (
      <div className="conversations-panel">
        <div className="conversations-header">
          <div className="conversations-title">Conversations</div>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '10px' }}>Loading conversations...</p>
        </div>
      </div>
    );
  }
  
  if (!conversations || conversations.length === 0) {
    return (
      <div className="conversations-panel">
        <div className="conversations-header">
          <div className="conversations-title">Conversations</div>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          No conversations yet. When customers message your Facebook page, they'll appear here.
        </div>
      </div>
    );
  }

  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5; // hours
    
    if (diffInHours < 24) {
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div className="conversations-panel">
      <div className="conversations-header">
        <div className="conversations-title">Conversations</div>
      </div>
      
      {conversations.map(conversation => (
        <div 
          key={conversation._id}
          className={`conversation-item ${selectedConversationId === conversation._id ? 'active' : ''}`}
          onClick={() => onSelectConversation(conversation._id)}
        >
          <div className="conversation-name">
            {conversation.customerName}
          </div>
          <div className="conversation-message">
            {conversation.lastMessage ? conversation.lastMessage.content : 'New conversation'}
          </div>
          <div className="conversation-time" style={{ fontSize: '0.8rem', color: '#65676b', marginTop: '5px' }}>
            {formatTimestamp(conversation.lastMessageTimestamp)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList; 