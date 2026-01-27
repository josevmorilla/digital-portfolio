import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumesAPI } from '../../services/api';
import './AdminCrud.css';

const AdminResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleFr: '',
    descriptionEn: '',
    descriptionFr: '',
    fileUrl: '',
    language: 'en',
    order: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumesAPI.getAll();
      setResumes(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        descriptionEn: formData.descriptionEn || null,
        descriptionFr: formData.descriptionFr || null,
      };

      if (editing) {
        await resumesAPI.update(editing, data);
        setMessage('Resume updated successfully!');
      } else {
        await resumesAPI.create(data);
        setMessage('Resume created successfully!');
      }
      resetForm();
      fetchResumes();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving resume: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (resume) => {
    setEditing(resume.id);
    setFormData({
      titleEn: resume.titleEn,
      titleFr: resume.titleFr,
      descriptionEn: resume.descriptionEn || '',
      descriptionFr: resume.descriptionFr || '',
      fileUrl: resume.fileUrl,
      language: resume.language,
      order: resume.order,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await resumesAPI.delete(id);
      setMessage('Resume deleted successfully!');
      fetchResumes();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting resume');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      titleEn: '',
      titleFr: '',
      descriptionEn: '',
      descriptionFr: '',
      fileUrl: '',
      language: 'en',
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
          <h1>Manage Resumes</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {message && <div className="message success">{message}</div>}

          <div className="crud-container">
            <div className="form-section">
              <h2>{editing ? 'Edit Resume' : 'Add New Resume'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title (English) *</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g., Full Stack Developer Resume"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Title (French) *</label>
                  <input
                    type="text"
                    value={formData.titleFr}
                    onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                    placeholder="e.g., CV Développeur Full Stack"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description (English)</label>
                  <textarea
                    rows="3"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>

                <div className="form-group">
                  <label>Description (French)</label>
                  <textarea
                    rows="3"
                    value={formData.descriptionFr}
                    onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                    placeholder="Description optionnelle"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>File URL *</label>
                    <input
                      type="text"
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      placeholder="/uploads/resumes/resume.pdf"
                      required
                    />
                    <small>Upload file to /uploads/resumes/ directory and enter path</small>
                  </div>

                  <div className="form-group">
                    <label>Language *</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      required
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                  <small>Lower numbers appear first</small>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary">
                    {editing ? 'Update Resume' : 'Create Resume'}
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
              <h2>Existing Resumes</h2>
              <div className="items-list">
                {resumes.map((resume) => (
                  <div key={resume.id} className="item-card">
                    <div className="item-header">
                      <h3>{resume.titleEn}</h3>
                      <span className="badge">{resume.language.toUpperCase()}</span>
                    </div>
                    <p className="item-meta">{resume.titleFr}</p>
                    <p className="item-meta" style={{fontSize: '0.85rem', color: '#666'}}>
                      {resume.fileUrl}
                    </p>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(resume)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(resume.id)} className="btn-delete">Delete</button>
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

export default AdminResumes;
