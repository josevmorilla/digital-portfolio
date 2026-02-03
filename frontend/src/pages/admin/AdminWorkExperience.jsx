import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workExperienceAPI } from '../../services/api';
import './AdminCrud.css';

const AdminWorkExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyEn: '',
    companyFr: '',
    positionEn: '',
    positionFr: '',
    descriptionEn: '',
    descriptionFr: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    order: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await workExperienceAPI.getAll();
      setExperiences(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching work experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate && !formData.current ? new Date(formData.endDate) : null,
      };

      if (editing) {
        await workExperienceAPI.update(editing, data);
        setMessage('Experience updated successfully!');
      } else {
        await workExperienceAPI.create(data);
        setMessage('Experience created successfully!');
      }
      resetForm();
      fetchExperiences();
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving experience: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (exp) => {
    setEditing(exp.id);
    setFormData({
      companyEn: exp.companyEn,
      companyFr: exp.companyFr,
      positionEn: exp.positionEn,
      positionFr: exp.positionFr,
      descriptionEn: exp.descriptionEn,
      descriptionFr: exp.descriptionFr,
      location: exp.location || '',
      startDate: new Date(exp.startDate).toISOString().split('T')[0],
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      current: exp.current,
      order: exp.order,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      await workExperienceAPI.delete(id);
      setMessage('Experience deleted successfully!');
      fetchExperiences();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting experience');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({
      companyEn: '',
      companyFr: '',
      positionEn: '',
      positionFr: '',
      descriptionEn: '',
      descriptionFr: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      order: 0,
    });
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Work Experience</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container crud-container">
          {message && <div className="message success">{message}</div>}

          {showForm && (
            <div className="form-section">
              <h2>{editing ? 'Edit Experience' : 'Add New Experience'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company (English) *</label>
                    <input
                      type="text"
                      value={formData.companyEn}
                      onChange={(e) => setFormData({ ...formData, companyEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Company (French) *</label>
                    <input
                      type="text"
                      value={formData.companyFr}
                      onChange={(e) => setFormData({ ...formData, companyFr: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Position (English) *</label>
                    <input
                      type="text"
                      value={formData.positionEn}
                      onChange={(e) => setFormData({ ...formData, positionEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Position (French) *</label>
                    <input
                      type="text"
                      value={formData.positionFr}
                      onChange={(e) => setFormData({ ...formData, positionFr: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description (English) *</label>
                  <textarea
                    rows="4"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description (French) *</label>
                  <textarea
                    rows="4"
                    value={formData.descriptionFr}
                    onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Province/State"
                    />
                  </div>

                  <div className="form-group">
                    <label>Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.current}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                    />
                    <span>Currently working here</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary">
                    {editing ? 'Update Experience' : 'Create Experience'}
                  </button>
                  <button type="button" onClick={resetForm} className="secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="list-section">
            <div className="crud-header">
              <h2>All Work Experience ({experiences.length})</h2>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="btn-add-new">
                  + Add New Experience
                </button>
              )}
            </div>
            <div className="items-list">
                {experiences.map((exp) => (
                  <div key={exp.id} className="item-card">
                    <div className="item-header">
                      <h3>{exp.positionEn}</h3>
                      {exp.current && <span className="badge">Current</span>}
                    </div>
                    <p className="item-meta">
                      {exp.companyEn} - {exp.location}
                    </p>
                    <p className="item-meta">
                      {new Date(exp.startDate).toLocaleDateString()} - 
                      {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                    </p>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(exp)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(exp.id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default AdminWorkExperience;
