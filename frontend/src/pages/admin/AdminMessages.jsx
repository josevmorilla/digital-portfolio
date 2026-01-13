import React from 'react';
import { Link } from 'react-router-dom';
import './AdminCrud.css';

const AdminMessages = () => {
  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Contact Messages</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>
      <main className="admin-main">
        <div className="container">
          <div className="message info">Contact messages inbox - View and manage messages from the contact form</div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessages;
