import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactInfoAPI } from '../../services/api';
import './AdminCrud.css';

const AdminContactInfo = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'email',
    label: '',
    value: '',
    icon: '',
    visible: true,
    order: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactInfoAPI.getAll();
      setContacts(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await contactInfoAPI.update(editing, formData);
        setMessage('Contact info updated successfully!');
      } else {
        await contactInfoAPI.create(formData);
        setMessage('Contact info created successfully!');
      }
      resetForm();
      fetchContacts();
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving contact info: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (contact) => {
    setEditing(contact.id);
    setFormData({
      type: contact.type,
      label: contact.label,
      value: contact.value,
      icon: contact.icon || '',
      visible: contact.visible,
      order: contact.order,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact info?')) return;
    
    try {
      await contactInfoAPI.delete(id);
      setMessage('Contact info deleted successfully!');
      fetchContacts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting contact info');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({
      type: 'email',
      label: '',
      value: '',
      icon: '',
      visible: true,
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
          <h1>Manage Contact Info</h1>
          <Link to="/manage" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container crud-container">
          {message && <div className="message success">{message}</div>}

          {showForm && (
            <div className="form-section">
              <h2>{editing ? 'Edit Contact Info' : 'Add New Contact Info'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="location">Location</option>
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Label *</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Email, Phone, GitHub"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Value *</label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g., email@example.com, +1234567890"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Icon (optional)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Icon name or URL"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                      />
                      <span>Visible on public page</span>
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
                    {editing ? 'Update Contact Info' : 'Create Contact Info'}
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
              <h2>All Contact Info ({contacts.length})</h2>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="btn-add-new">
                  + Add New Contact Info
                </button>
              )}
            </div>
            <div className="items-list">
                {contacts.map((contact) => (
                  <div key={contact.id} className="item-card">
                    <div className="item-header">
                      <h3>{contact.label}</h3>
                      {!contact.visible && <span className="badge">Hidden</span>}
                    </div>
                    <p className="item-meta">Type: {contact.type}</p>
                    <p className="item-meta">Value: {contact.value}</p>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(contact)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(contact.id)} className="btn-delete">Delete</button>
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
  
  export default AdminContactInfo;
