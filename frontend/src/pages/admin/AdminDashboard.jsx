import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiCode, 
  FiBriefcase, 
  FiBook, 
  FiUser, 
  FiMail, 
  FiHeart, 
  FiMessageSquare, 
  FiFileText,
  FiInbox,
  FiEye,
  FiCheckCircle,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const sections = [
    { name: 'Profile', path: '/profile', icon: <FiSettings /> },
    { name: 'Skills', path: '/skills', icon: <FiCode /> },
    { name: 'Projects', path: '/projects', icon: <FiBriefcase /> },
    { name: 'Work Experience', path: '/work-experience', icon: <FiUser /> },
    { name: 'Education', path: '/education', icon: <FiBook /> },
    { name: 'Contact Info', path: '/contact-info', icon: <FiMail /> },
    { name: 'Hobbies', path: '/hobbies', icon: <FiHeart /> },
    { name: 'Testimonials', path: '/review-testimonials', icon: <FiMessageSquare /> },
    { name: 'Messages', path: '/messages', icon: <FiInbox /> },
    { name: 'Resumes', path: '/resumes', icon: <FiFileText /> },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="container">
          <h1>Dashboard</h1>
          <div className="admin-user">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="btn-logout">
              <FiLogOut /> Logout
            </button>
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
                <FiEye /> View Public Site
              </a>
              <Link to="/messages" className="action-btn">
                <FiInbox /> View Messages
              </Link>
              <Link to="/review-testimonials" className="action-btn">
                <FiCheckCircle /> Approve Testimonials
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
