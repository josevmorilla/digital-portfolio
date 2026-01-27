import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hobbiesAPI } from '../../services/api';
import './AdminCrud.css';

const AdminHobbies = () => {
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameFr: '',
    descriptionEn: '',
    descriptionFr: '',
    icon: '',
    order: 0,
  });
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await hobbiesAPI.update(editing, formData);
        setMessage('Hobby updated successfully!');
      } else {
        await hobbiesAPI.create(formData);
        setMessage('Hobby created successfully!');
      }
      resetForm();
      fetchHobbies();
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
      order: hobby.order,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hobby?')) return;
    
    try {
      await hobbiesAPI.delete(id);
      setMessage('Hobby deleted successfully!');
      fetchHobbies();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting hobby');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      nameEn: '',
      nameFr: '',
      descriptionEn: '',
      descriptionFr: '',
      icon: '',
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
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {message && <div className="message success">{message}</div>}

          <div className="crud-container">
            <div className="form-section">
              <h2>{editing ? 'Edit Hobby' : 'Add New Hobby'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name (English) *</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Name (French) *</label>
                    <input
                      type="text"
                      value={formData.nameFr}
                      onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
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
                    <label>Icon (optional)</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="Icon name or URL"
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

                <div className="form-actions">
                  <button type="submit" className="primary">
                    {editing ? 'Update Hobby' : 'Create Hobby'}
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
              <h2>Existing Hobbies</h2>
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
        </div>
      </main>
    </div>
  );
};

export default AdminHobbies;
