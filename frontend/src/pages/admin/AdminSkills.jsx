import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillsAPI } from '../../services/api';
import './AdminCrud.css';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameEs: '',
    level: 50,
    category: '',
    icon: '',
    order: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSkills();
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
    } catch (error) {
      setMessage('Error saving skill: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (skill) => {
    setEditing(skill.id);
    setFormData({
      nameEn: skill.nameEn,
      nameEs: skill.nameEs,
      level: skill.level,
      category: skill.category,
      icon: skill.icon || '',
      order: skill.order,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await skillsAPI.delete(id);
      setMessage('Skill deleted successfully!');
      fetchSkills();
    } catch (error) {
      setMessage('Error deleting skill');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      nameEn: '',
      nameEs: '',
      level: 50,
      category: '',
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
          <h1>Manage Skills</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {message && <div className="message success">{message}</div>}

          <div className="crud-container">
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
                  <label>Name (Spanish) *</label>
                  <input
                    type="text"
                    value={formData.nameEs}
                    onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
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
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Programming, Design"
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

                <div className="form-group">
                  <label>Order</label>
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
                  {editing && (
                    <button type="button" onClick={resetForm} className="secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="list-section">
              <h2>Existing Skills</h2>
              <div className="items-list">
                {skills.length === 0 ? (
                  <p>No skills yet. Add your first skill!</p>
                ) : (
                  skills.map((skill) => (
                    <div key={skill.id} className="item-card">
                      <div className="item-info">
                        <h3>{skill.nameEn} / {skill.nameEs}</h3>
                        <p>Level: {skill.level}% | Category: {skill.category}</p>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => handleEdit(skill)} className="primary">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(skill.id)} className="danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSkills;
