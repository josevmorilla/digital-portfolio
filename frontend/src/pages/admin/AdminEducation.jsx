import React from 'react';
import { Link } from 'react-router-dom';
import './AdminCrud.css';

const AdminEducation = () => {
  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Education</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>
      <main className="admin-main">
        <div className="container">
          <div className="message info">Education management page - CRUD functionality similar to Skills page</div>
        </div>
      </main>
    </div>
  );
};

export default AdminEducation;
