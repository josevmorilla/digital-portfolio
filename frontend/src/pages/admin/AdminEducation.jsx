import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { educationAPI } from '../../services/api';
import './AdminCrud.css';

const AdminEducation = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    institutionEn: '',
    institutionFr: '',
    degreeEn: '',
    degreeFr: '',
    fieldEn: '',
    fieldFr: '',
    descriptionEn: '',
    descriptionFr: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    order: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await educationAPI.getAll();
      setEducations(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching education:', error);
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
        gpa: formData.gpa || null,
      };

      if (editing) {
        await educationAPI.update(editing, data);
        setMessage('Education updated successfully!');
      } else {
        await educationAPI.create(data);
        setMessage('Education created successfully!');
      }
      resetForm();
      fetchEducations();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving education: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (edu) => {
    setEditing(edu.id);
    setFormData({
      institutionEn: edu.institutionEn,
      institutionFr: edu.institutionFr,
      degreeEn: edu.degreeEn,
      degreeFr: edu.degreeFr,
      fieldEn: edu.fieldEn,
      fieldFr: edu.fieldFr,
      descriptionEn: edu.descriptionEn || '',
      descriptionFr: edu.descriptionFr || '',
      location: edu.location || '',
      startDate: new Date(edu.startDate).toISOString().split('T')[0],
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      current: edu.current,
      gpa: edu.gpa || '',
      order: edu.order,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education?')) return;
    
    try {
      await educationAPI.delete(id);
      setMessage('Education deleted successfully!');
      fetchEducations();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting education');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      institutionEn: '',
      institutionFr: '',
      degreeEn: '',
      degreeFr: '',
      fieldEn: '',
      fieldFr: '',
      descriptionEn: '',
      descriptionFr: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
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
          <h1>Manage Education</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {message && <div className="message success">{message}</div>}

          <div className="crud-container">
            <div className="form-section">
              <h2>{editing ? 'Edit Education' : 'Add New Education'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Institution (English) *</label>
                    <input
                      type="text"
                      value={formData.institutionEn}
                      onChange={(e) => setFormData({ ...formData, institutionEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Institution (French) *</label>
                    <input
                      type="text"
                      value={formData.institutionFr}
                      onChange={(e) => setFormData({ ...formData, institutionFr: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Degree (English) *</label>
                    <input
                      type="text"
                      value={formData.degreeEn}
                      onChange={(e) => setFormData({ ...formData, degreeEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Degree (French) *</label>
                    <input
                      type="text"
                      value={formData.degreeFr}
                      onChange={(e) => setFormData({ ...formData, degreeFr: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Field (English) *</label>
                    <input
                      type="text"
                      value={formData.fieldEn}
                      onChange={(e) => setFormData({ ...formData, fieldEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Field (French) *</label>
                    <input
                      type="text"
                      value={formData.fieldFr}
                      onChange={(e) => setFormData({ ...formData, fieldFr: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description (English)</label>
                  <textarea
                    rows="3"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description (French)</label>
                  <textarea
                    rows="3"
                    value={formData.descriptionFr}
                    onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
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
                    <label>GPA</label>
                    <input
                      type="text"
                      value={formData.gpa}
                      onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                      placeholder="e.g., 3.8/4.0"
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

                <div className="form-row">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.current}
                        onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                      />
                      <span>Currently studying here</span>
                    </label>
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

                <div className="form-actions">
                  <button type="submit" className="primary">
                    {editing ? 'Update Education' : 'Create Education'}
                  </button>
                  {editing && (
                    <button type="button" onClick={resetForm} className="secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="list-section">
              <h2>Existing Education</h2>
              <div className="items-list">
                {educations.map((edu) => (
                  <div key={edu.id} className="item-card">
                    <div className="item-header">
                      <h3>{edu.degreeEn} in {edu.fieldEn}</h3>
                      {edu.current && <span className="badge">Current</span>}
                    </div>
                    <p className="item-meta">
                      {edu.institutionEn} - {edu.location}
                    </p>
                    <p className="item-meta">
                      {new Date(edu.startDate).toLocaleDateString()} - 
                      {edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString()}
                    </p>
                    {edu.gpa && <p className="item-meta">GPA: {edu.gpa}</p>}
                    <div className="item-actions">
                      <button onClick={() => handleEdit(edu)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(edu.id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEducation;
