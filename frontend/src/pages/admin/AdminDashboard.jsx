import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const sections = [
    { name: 'Skills', path: '/admin/skills', icon: '🛠️' },
    { name: 'Projects', path: '/admin/projects', icon: '💼' },
    { name: 'Work Experience', path: '/admin/work-experience', icon: '👔' },
    { name: 'Education', path: '/admin/education', icon: '🎓' },
    { name: 'Contact Info', path: '/admin/contact-info', icon: '📞' },
    { name: 'Hobbies', path: '/admin/hobbies', icon: '🎯' },
    { name: 'Testimonials', path: '/admin/testimonials', icon: '💬' },
    { name: 'Messages', path: '/admin/messages', icon: '📧' },
    { name: 'Resumes', path: '/admin/resumes', icon: '📄' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <div className="admin-user">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="secondary">Logout</button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          <div className="dashboard-grid">
            {sections.map((section) => (
              <Link key={section.path} to={section.path} className="dashboard-card">
                <div className="card-icon">{section.icon}</div>
                <h3>{section.name}</h3>
              </Link>
            ))}
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <a href="/" target="_blank" rel="noopener noreferrer" className="action-btn">
                View Public Site
              </a>
              <Link to="/admin/messages" className="action-btn">
                View Messages
              </Link>
              <Link to="/admin/testimonials" className="action-btn">
                Approve Testimonials
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
