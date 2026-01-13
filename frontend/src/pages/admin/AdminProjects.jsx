import React from 'react';
import { Link } from 'react-router-dom';
import './AdminCrud.css';

const AdminProjects = () => {
  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Projects</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>
      <main className="admin-main">
        <div className="container">
          <div className="message info">Projects management page - CRUD functionality similar to Skills page</div>
        </div>
      </main>
    </div>
  );
};

export default AdminProjects;
