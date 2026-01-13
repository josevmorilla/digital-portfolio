import React from 'react';
import { Link } from 'react-router-dom';
import './AdminCrud.css';

const AdminContactInfo = () => {
  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Contact Info</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>
      <main className="admin-main">
        <div className="container">
          <div className="message info">Contact Info management page - CRUD functionality similar to Skills page</div>
        </div>
      </main>
    </div>
  );
};

export default AdminContactInfo;
