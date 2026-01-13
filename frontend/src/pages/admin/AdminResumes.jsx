import React from 'react';
import { Link } from 'react-router-dom';
import './AdminCrud.css';

const AdminResumes = () => {
  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Resumes</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>
      <main className="admin-main">
        <div className="container">
          <div className="message info">Resume management page - Upload and manage CV/Resume files for download</div>
        </div>
      </main>
    </div>
  );
};

export default AdminResumes;
