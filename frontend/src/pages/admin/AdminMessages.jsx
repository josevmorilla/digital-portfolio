import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactMessagesAPI } from '../../services/api';
import './AdminCrud.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await contactMessagesAPI.getAll();
      // Sort by most recent first
      setMessages(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactMessagesAPI.markAsRead(id);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await contactMessagesAPI.delete(id);
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Contact Messages</h1>
          <Link to="/dashboard" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          <div className="messages-container">
            <div className="messages-list">
              <h2>Inbox ({messages.filter(m => !m.read).length} unread)</h2>
              <div className="items-list">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'active' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="message-header">
                      <h4>{message.name}</h4>
                      {!message.read && <span className="badge">New</span>}
                    </div>
                    <p className="message-meta">{message.email}</p>
                    <p className="message-preview">{message.message.substring(0, 80)}...</p>
                    <p className="message-date">{formatDate(message.createdAt)}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p style={{textAlign: 'center', color: '#666', padding: '2rem'}}>
                    No messages yet
                  </p>
                )}
              </div>
            </div>

            {selectedMessage && (
              <div className="message-detail">
                <div className="detail-header">
                  <h2>Message Details</h2>
                  <button onClick={() => setSelectedMessage(null)} className="btn-close">×</button>
                </div>
                
                <div className="detail-content">
                  <div className="detail-field">
                    <label>From:</label>
                    <p>{selectedMessage.name}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label>Email:</label>
                    <p><a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></p>
                  </div>
                  
                  {selectedMessage.phone && (
                    <div className="detail-field">
                      <label>Phone:</label>
                      <p>{selectedMessage.phone}</p>
                    </div>
                  )}
                  
                  <div className="detail-field">
                    <label>Subject:</label>
                    <p>{selectedMessage.subject || 'No subject'}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label>Date:</label>
                    <p>{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label>Message:</label>
                    <p style={{whiteSpace: 'pre-wrap'}}>{selectedMessage.message}</p>
                  </div>
                  
                  <div className="detail-actions">
                    {!selectedMessage.read && (
                      <button 
                        onClick={() => handleMarkAsRead(selectedMessage.id)} 
                        className="primary"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(selectedMessage.id)} 
                      className="btn-delete"
                    >
                      Delete Message
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessages;
