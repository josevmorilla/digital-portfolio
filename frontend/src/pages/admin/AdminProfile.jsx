import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileAPI } from '../../services/api';
import './AdminCrud.css';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameFr: '',
    titleEn: '',
    titleFr: '',
    bioEn: '',
    bioFr: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.get();
      if (response.data) {
        setFormData({
          nameEn: response.data.nameEn || '',
          nameFr: response.data.nameFr || '',
          titleEn: response.data.titleEn || '',
          titleFr: response.data.titleFr || '',
          bioEn: response.data.bioEn || '',
          bioFr: response.data.bioFr || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.update(formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving profile: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Profile</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container crud-container">
          {message && <div className="message success">{message}</div>}

          <div className="form-section">
            <h2>Profile Information</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              This information is displayed in the header, hero section, and footer of your portfolio.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name (English) *</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Your full name in English"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Name (French) *</label>
                  <input
                    type="text"
                    value={formData.nameFr}
                    onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                    placeholder="Votre nom complet en français"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Title (English) *</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g., Full Stack Developer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Title (French) *</label>
                  <input
                    type="text"
                    value={formData.titleFr}
                    onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                    placeholder="ex: Développeur Full Stack"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bio (English)</label>
                  <textarea
                    rows="4"
                    value={formData.bioEn}
                    onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                    placeholder="A short bio about yourself in English"
                  />
                </div>
                <div className="form-group">
                  <label>Bio (French)</label>
                  <textarea
                    rows="4"
                    value={formData.bioFr}
                    onChange={(e) => setFormData({ ...formData, bioFr: e.target.value })}
                    placeholder="Une courte biographie en français"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
