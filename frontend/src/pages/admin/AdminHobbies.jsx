import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hobbiesAPI, getUploadUrl } from '../../services/api';
import './AdminCrud.css';

const AdminHobbies = () => {
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameFr: '',
    descriptionEn: '',
    descriptionFr: '',
    icon: '',
    imageUrl: '',
    technologies: '',
    links: [{ label: '', url: '', _key: crypto.randomUUID() }],
    startDate: '',
    endDate: '',
    featured: false,
    order: 0,
  });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHobbies();
  }, []);

  const fetchHobbies = async () => {
    try {
      const response = await hobbiesAPI.getAll();
      setHobbies(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching hobbies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Please upload JPG, PNG, GIF, or WEBP images.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('File size too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await hobbiesAPI.uploadImage(uploadFormData);
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
      const hobbyData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        links: formData.links.filter(link => link.label && link.url),
        imageUrl: formData.imageUrl || null,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
      };

      if (editing) {
        await hobbiesAPI.update(editing, hobbyData);
        setMessage('Hobby updated successfully!');
      } else {
        await hobbiesAPI.create(hobbyData);
        setMessage('Hobby created successfully!');
      }
      resetForm();
      fetchHobbies();
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving hobby: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (hobby) => {
    setEditing(hobby.id);
    setFormData({
      nameEn: hobby.nameEn,
      nameFr: hobby.nameFr,
      descriptionEn: hobby.descriptionEn || '',
      descriptionFr: hobby.descriptionFr || '',
      icon: hobby.icon || '',
      imageUrl: hobby.imageUrl || '',
      technologies: hobby.technologies?.join(', ') || '',
      links: hobby.links?.length > 0 ? hobby.links.map(l => ({ ...l, _key: crypto.randomUUID() })) : [{ label: '', url: '', _key: crypto.randomUUID() }],
      startDate: hobby.startDate ? new Date(hobby.startDate).toISOString().split('T')[0] : '',
      endDate: hobby.endDate ? new Date(hobby.endDate).toISOString().split('T')[0] : '',
      featured: hobby.featured || false,
      order: hobby.order,
    });
    setShowForm(true);
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!globalThis.confirm('Are you sure you want to delete this hobby?')) return;
    
    try {
      await hobbiesAPI.delete(id);
      setMessage('Hobby deleted successfully!');
      fetchHobbies();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting hobby: ' + (error.response?.data?.error || error.message));
    }
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({
      nameEn: '',
      nameFr: '',
      descriptionEn: '',
      descriptionFr: '',
      icon: '',
      imageUrl: '',
      technologies: '',
      links: [{ label: '', url: '', _key: crypto.randomUUID() }],
      startDate: '',
      endDate: '',
      featured: false,
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
          <h1>Manage Hobbies</h1>
          <Link to="/dashboard" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container crud-container">
          {message && <div className="message success">{message}</div>}

          {showForm && (
            <div className="form-section">
              <h2>{editing ? 'Edit Hobby' : 'Add New Hobby'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hobby-nameEn">Name (English) *</label>
                    <input
                      id="hobby-nameEn"
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hobby-nameFr">Name (French) *</label>
                    <input
                      id="hobby-nameFr"
                      type="text"
                      value={formData.nameFr}
                      onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="hobby-descEn">Description (English)</label>
                  <textarea
                    id="hobby-descEn"
                    rows="3"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hobby-descFr">Description (French)</label>
                  <textarea
                    id="hobby-descFr"
                    rows="3"
                    value={formData.descriptionFr}
                    onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hobby-startDate">Start Date</label>
                    <input
                      id="hobby-startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hobby-endDate">End Date (leave empty if ongoing)</label>
                    <input
                      id="hobby-endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="hobby-technologies">Technologies (comma-separated)</label>
                  <input
                    id="hobby-technologies"
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="Lua, HUD scripting, Source Engine"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hobby-image">Hobby Image</label>
                    <input
                      id="hobby-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <small className="text-muted">Uploading...</small>}
                    {formData.imageUrl && (
                      <div className="image-preview">
                        <img src={getUploadUrl(formData.imageUrl)} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
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
                    <label htmlFor="hobby-imageUrl">Image URL (Alternative)</label>
                    <input
                      id="hobby-imageUrl"
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="hobby-links">Links (GitHub, GameBanana, etc.)</label>
                  {formData.links.map((link, index) => (
                    <div key={link._key} className="form-row" style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newLinks = [...formData.links];
                          newLinks[index].label = e.target.value;
                          setFormData({ ...formData, links: newLinks });
                        }}
                        placeholder="Link label (e.g., GitHub, GameBanana)"
                        style={{ flex: 1, marginRight: '10px' }}
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...formData.links];
                          newLinks[index].url = e.target.value;
                          setFormData({ ...formData, links: newLinks });
                        }}
                        placeholder="URL (e.g., github.com/user/repo)"
                        style={{ flex: 2, marginRight: '10px' }}
                      />
                      {formData.links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newLinks = formData.links.filter((_, i) => i !== index);
                            setFormData({ ...formData, links: newLinks });
                          }}
                          className="btn-delete"
                          style={{ padding: '5px 10px' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, links: [...formData.links, { label: '', url: '', _key: crypto.randomUUID() }] })}
                    className="secondary"
                    style={{ marginTop: '10px' }}
                  >
                    + Add Link
                  </button>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hobby-icon">Icon (optional)</label>
                    <input
                      id="hobby-icon"
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="Icon name or URL"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hobby-order">Order</label>
                    <input
                      id="hobby-order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value, 10) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Featured (shows in large project-style layout)</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary">
                    {editing ? 'Update Hobby' : 'Create Hobby'}
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
              <h2>All Hobbies ({hobbies.length})</h2>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="btn-add-new">
                  + Add New Hobby
                </button>
              )}
            </div>
            <div className="items-list">
                {hobbies.map((hobby) => (
                  <div key={hobby.id} className="item-card">
                    <div className="item-header">
                      <h3>{hobby.nameEn} / {hobby.nameFr}</h3>
                    </div>
                    <p className="item-meta">{hobby.descriptionEn}</p>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(hobby)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(hobby.id)} className="btn-delete">Delete</button>
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
  
  export default AdminHobbies;
