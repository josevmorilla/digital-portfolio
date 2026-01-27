import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testimonialsAPI } from '../../services/api';
import './AdminCrud.css';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    content: '',
    imageUrl: '',
    approved: false,
    order: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll();
      setTestimonials(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        company: formData.company || null,
        imageUrl: formData.imageUrl || null,
      };

      if (editing) {
        await testimonialsAPI.update(editing, data);
        setMessage('Testimonial updated successfully!');
      } else {
        await testimonialsAPI.create(data);
        setMessage('Testimonial created successfully!');
      }
      resetForm();
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving testimonial: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (testimonial) => {
    setEditing(testimonial.id);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company || '',
      content: testimonial.content,
      imageUrl: testimonial.imageUrl || '',
      approved: testimonial.approved,
      order: testimonial.order,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await testimonialsAPI.delete(id);
      setMessage('Testimonial deleted successfully!');
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting testimonial');
    }
  };

  const toggleApproval = async (testimonial) => {
    try {
      await testimonialsAPI.update(testimonial.id, {
        ...testimonial,
        approved: !testimonial.approved,
      });
      setMessage(`Testimonial ${!testimonial.approved ? 'approved' : 'unapproved'} successfully!`);
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating approval status');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: '',
      position: '',
      company: '',
      content: '',
      imageUrl: '',
      approved: false,
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
          <h1>Manage Testimonials</h1>
          <Link to="/admin" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {message && <div className="message success">{message}</div>}

          <div className="crud-container">
            <div className="form-section">
              <h2>{editing ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Position *</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., Software Engineer"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Testimonial Content *</label>
                  <textarea
                    rows="5"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
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

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.approved}
                      onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                    />
                    <span>Approved (visible on public page)</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary">
                    {editing ? 'Update Testimonial' : 'Create Testimonial'}
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
              <h2>Existing Testimonials</h2>
              <div className="items-list">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="item-card">
                    <div className="item-header">
                      <h3>{testimonial.name}</h3>
                      {testimonial.approved ? (
                        <span className="badge">Approved</span>
                      ) : (
                        <span className="badge" style={{background: '#fbbf24'}}>Pending</span>
                      )}
                    </div>
                    <p className="item-meta">
                      {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                    </p>
                    <p className="item-meta" style={{fontStyle: 'italic'}}>
                      "{testimonial.content.substring(0, 100)}..."
                    </p>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(testimonial)} className="btn-edit">Edit</button>
                      <button 
                        onClick={() => toggleApproval(testimonial)} 
                        className="btn-edit"
                        style={{background: testimonial.approved ? '#fbbf24' : '#22c55e'}}
                      >
                        {testimonial.approved ? 'Unapprove' : 'Approve'}
                      </button>
                      <button onClick={() => handleDelete(testimonial.id)} className="btn-delete">Delete</button>
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

export default AdminTestimonials;
