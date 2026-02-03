import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';
import './AdminCrud.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleFr: '',
    descriptionEn: '',
    descriptionFr: '',
    imageUrl: '',
    projectUrl: '',
    githubUrl: '',
    technologies: '',
    featured: false,
    order: 0,
    startDate: '',
    endDate: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Please upload JPG, PNG, GIF, or WEBP images.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('File size too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await projectsAPI.uploadImage(uploadFormData);
      setFormData({ ...formData, imageUrl: response.data.imageUrl });
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading image: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Auto-add https:// to URLs if missing
      const normalizeUrl = (url) => {
        if (!url) return null;
        const trimmed = url.trim();
        if (trimmed && !trimmed.match(/^https?:\/\//i)) {
          return `https://${trimmed}`;
        }
        return trimmed || null;
      };

      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
        imageUrl: formData.imageUrl || null,
        projectUrl: normalizeUrl(formData.projectUrl),
        githubUrl: normalizeUrl(formData.githubUrl),
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
      };

      if (editing) {
        await projectsAPI.update(editing, projectData);
        setMessage('Project updated successfully!');
      } else {
        await projectsAPI.create(projectData);
        setMessage('Project created successfully!');
      }
      resetForm();
      fetchProjects();
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving project: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (project) => {
    setEditing(project.id);
    setFormData({
      titleEn: project.titleEn,
      titleFr: project.titleFr,
      descriptionEn: project.descriptionEn,
      descriptionFr: project.descriptionFr,
      imageUrl: project.imageUrl || '',
      projectUrl: project.projectUrl || '',
      githubUrl: project.githubUrl || '',
      technologies: project.technologies.join(', '),
      featured: project.featured,
      order: project.order,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectsAPI.delete(id);
      setMessage('Project deleted successfully!');
      fetchProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting project');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({
      titleEn: '',
      titleFr: '',
      descriptionEn: '',
      descriptionFr: '',
      imageUrl: '',
      projectUrl: '',
      githubUrl: '',
      technologies: '',
      featured: false,
      order: 0,
      startDate: '',
      endDate: '',
    });
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Projects</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container crud-container">
          {message && <div className="message success">{message}</div>}

          {showForm && (
            <div className="form-section">
              <h2>{editing ? 'Edit Project' : 'Add New Project'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title (English) *</label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Title (French) *</label>
                    <input
                      type="text"
                      value={formData.titleFr}
                      onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
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
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date (leave empty if ongoing)</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Technologies (comma-separated) *</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Project Screenshot/Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <small className="text-muted">Uploading...</small>}
                    {formData.imageUrl && (
                      <div className="image-preview">
                        <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                        <button 
                          type="button" 
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="btn-small"
                          style={{ marginTop: '5px' }}
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Image URL (Alternative)</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Or paste URL: https://example.com/image.png"
                      disabled={uploading}
                    />
                    <small className="text-muted">Upload a file above OR paste a URL here</small>
                  </div>
                </div>

                <div className="form-row">
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
                    <label>GitHub URL</label>
                    <input
                      type="text"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username/repo or github.com/username/repo"
                    />
                    <small className="text-muted">https:// will be added automatically if missing</small>
                  </div>

                  <div className="form-group">
                    <label>Deployed Project URL</label>
                    <input
                      type="text"
                      value={formData.projectUrl}
                      onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                      placeholder="https://myproject.com or myproject.vercel.app"
                    />
                    <small className="text-muted">https:// will be added automatically if missing</small>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Featured Project (shows in large timeline layout)</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary">
                    {editing ? 'Update Project' : 'Create Project'}
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
              <h2>All Projects ({projects.length})</h2>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="btn-add-new">
                  + Add New Project
                </button>
              )}
            </div>
            <div className="items-list">
                {projects.map((project) => (
                  <div key={project.id} className="item-card">
                    <div className="item-header">
                      <h3>{project.titleEn} / {project.titleFr}</h3>
                      {project.featured && <span className="badge">Featured</span>}
                    </div>
                    <p className="item-meta">
                      Technologies: {project.technologies.join(', ')}
                    </p>
                    <p className="item-meta">
                      {project.startDate && new Date(project.startDate).toLocaleDateString()} - 
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(project)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(project.id)} className="btn-delete">Delete</button>
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

export default AdminProjects;
