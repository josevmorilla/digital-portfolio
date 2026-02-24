import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillsAPI, categorySettingsAPI } from '../../services/api';
import './AdminCrud.css';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameFr: '',
    level: 50,
    category: '',
    icon: '',
    order: 0,
  });
  const [message, setMessage] = useState('');

  // Category settings state
  const [catEdits, setCatEdits] = useState([]);
  const [catMessage, setCatMessage] = useState('');

  useEffect(() => {
    fetchSkills();
    fetchCategorySettings();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorySettings = async () => {
    try {
      const response = await categorySettingsAPI.getAll();
      setCatEdits(response.data.map(s => ({ ...s })));
    } catch (error) {
      console.error('Error fetching category settings:', error);
    }
  };

  const handleSaveCategorySettings = async () => {
    try {
      const response = await categorySettingsAPI.updateAll(
        catEdits.map(s => ({
          category: s.category,
          displayOrder: s.displayOrder,
          speed: s.speed,
        }))
      );
      setCatEdits(response.data.map(s => ({ ...s })));
      setCatMessage('Category settings saved!');
      setTimeout(() => setCatMessage(''), 3000);
    } catch (error) {
      setCatMessage('Error saving: ' + (error.response?.data?.error || error.message));
    }
  };

  const updateCatEdit = (category, field, value) => {
    setCatEdits(prev =>
      prev.map(cs =>
        cs.category === category ? { ...cs, [field]: parseInt(value) || 0 } : cs
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await skillsAPI.update(editing, formData);
        setMessage('Skill updated successfully!');
      } else {
        await skillsAPI.create(formData);
        setMessage('Skill created successfully!');
      }
      resetForm();
      fetchSkills();
      fetchCategorySettings();
      setShowForm(false);
    } catch (error) {
      setMessage('Error saving skill: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (skill) => {
    setEditing(skill.id);
    setFormData({
      nameEn: skill.nameEn,
      nameFr: skill.nameFr,
      level: skill.level,
      category: skill.category,
      icon: skill.icon || '',
      order: skill.order,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillsAPI.delete(id);
      setMessage('Skill deleted successfully!');
      fetchSkills();
      fetchCategorySettings();
    } catch (error) {
      setMessage('Error deleting skill');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setFormData({ nameEn: '', nameFr: '', level: 50, category: '', icon: '', order: 0 });
  };

  const categories = [...new Set(skills.map(s => s.category))];

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Skills</h1>
          <Link to="/dashboard" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container crud-container">
          {message && <div className="message success">{message}</div>}

          {/* Category Settings */}
          {catEdits.length > 0 && (
            <div className="form-section cat-settings-section">
              <h2>Category Carousel Settings</h2>
              <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Set the tab display order and auto-scroll speed for each category on the public site.
              </p>
              {catMessage && <div className="message success">{catMessage}</div>}
              <table className="cat-settings-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Tab Order</th>
                    <th>Speed (sec)</th>
                    <th>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {catEdits
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((cs) => (
                      <tr key={cs.category}>
                        <td><strong>{cs.category}</strong></td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={cs.displayOrder}
                            onChange={(e) => updateCatEdit(cs.category, 'displayOrder', e.target.value)}
                            className="cat-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            step="0.5"
                            value={cs.speed / 1000}
                            onChange={(e) => updateCatEdit(cs.category, 'speed', parseFloat(e.target.value) * 1000)}
                            className="cat-input"
                          />
                        </td>
                        <td>{skills.filter(s => s.category === cs.category).length}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="form-actions" style={{ marginTop: '1rem' }}>
                <button onClick={handleSaveCategorySettings} className="primary">
                  Save Category Settings
                </button>
              </div>
            </div>
          )}

          {/* Skill Form */}
          {showForm && (
            <div className="form-section">
              <h2>{editing ? 'Edit Skill' : 'Add New Skill'}</h2>
              <form onSubmit={handleSubmit}>
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
                <div className="form-group">
                  <label>Level (1-100) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__new__">+ New category...</option>
                  </select>
                  {formData.category === '__new__' && (
                    <input
                      type="text"
                      placeholder="Enter new category name"
                      style={{ marginTop: '0.5rem' }}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  )}
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
                <div className="form-group">
                  <label>Order (within category)</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="primary">
                    {editing ? 'Update Skill' : 'Create Skill'}
                  </button>
                  <button type="button" onClick={resetForm} className="secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Skills List grouped by category */}
          <div className="list-section">
            <div className="crud-header">
              <h2>All Skills ({skills.length})</h2>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="btn-add-new">
                  + Add New Skill
                </button>
              )}
            </div>

            {categories.map(cat => (
              <div key={cat} className="category-group">
                <h3 className="category-group-title">{cat} ({skills.filter(s => s.category === cat).length})</h3>
                <div className="items-list">
                  {skills
                    .filter(s => s.category === cat)
                    .map((skill) => (
                      <div key={skill.id} className="item-card">
                        <div className="item-info">
                          <h3>{skill.nameEn} / {skill.nameFr}</h3>
                          <p><strong>Level:</strong> {skill.level}% | <strong>Order:</strong> {skill.order}</p>
                          {skill.icon && <p><strong>Icon:</strong> {skill.icon}</p>}
                        </div>
                        <div className="item-actions">
                          <button onClick={() => handleEdit(skill)} className="primary">Edit</button>
                          <button onClick={() => handleDelete(skill.id)} className="danger">Delete</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            {skills.length === 0 && <p>No skills yet. Add your first skill!</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSkills;
