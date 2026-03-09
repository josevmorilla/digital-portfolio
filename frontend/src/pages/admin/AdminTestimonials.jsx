import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testimonialsAPI } from '../../services/api';
import './AdminCrud.css';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const handleDelete = async (id) => {
    if (!globalThis.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await testimonialsAPI.delete(id);
      setMessage('Testimonial deleted successfully!');
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting testimonial: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleApprove = async (id) => {
    try {
      await testimonialsAPI.approve(id);
      setMessage('Testimonial approved successfully!');
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error approving testimonial: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUnapprove = async (testimonial) => {
    try {
      await testimonialsAPI.update(testimonial.id, {
        ...testimonial,
        approved: false,
      });
      setMessage('Testimonial unapproved successfully!');
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error unapproving testimonial: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleReject = async (id) => {
    if (!globalThis.confirm('Are you sure you want to reject this testimonial? It will be permanently removed.')) return;
    
    try {
      await testimonialsAPI.reject(id);
      setMessage('Testimonial rejected and removed successfully!');
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error rejecting testimonial: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  const pendingTestimonials = testimonials.filter(t => !t.approved);
  const approvedTestimonials = testimonials.filter(t => t.approved);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const renderTestimonialCard = (testimonial, type) => {
    return (
      <div key={testimonial.id} className="testimonial-card-full">
        {/* Header */}
        <div className="testimonial-card-header">
          <div>
            <h3 className="testimonial-card-name">{testimonial.name}</h3>
            <span className={`status-badge status-${type}`}>
              {type === 'pending' ? 'Pending' : 'Approved'}
            </span>
          </div>
          <span className="testimonial-card-date">{formatDate(testimonial.createdAt)}</span>
        </div>

        {/* Info */}
        <div className="testimonial-section">
          <div className="testimonial-fields">
            <div className="testimonial-field">
              <span className="field-label">Name</span>
              <span className="field-value">{testimonial.name}</span>
            </div>
            {testimonial.company && (
              <div className="testimonial-field">
                <span className="field-label">Company / Role</span>
                <span className="field-value">{testimonial.company}</span>
              </div>
            )}
            {testimonial.position && (
              <div className="testimonial-field">
                <span className="field-label">Project</span>
                <span className="field-value">{testimonial.position}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="testimonial-section">
          <h4 className="testimonial-section-title">Testimonial</h4>
          <p className="feedback-answer" style={{whiteSpace: 'pre-wrap'}}>{testimonial.content}</p>
        </div>

        {/* Actions */}
        <div className="testimonial-card-actions">
          {type === 'pending' ? (
            <>
              <button onClick={() => handleApprove(testimonial.id)} className="btn-approve">
                ✓ Approve
              </button>
              <button onClick={() => handleReject(testimonial.id)} className="btn-danger">
                ✗ Reject
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleUnapprove(testimonial)} className="btn-unapprove">
                Unapprove
              </button>
              <button onClick={() => handleDelete(testimonial.id)} className="btn-danger">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-crud">
      <header className="admin-header">
        <div className="container">
          <h1>Manage Testimonials</h1>
          <Link to="/dashboard" className="secondary">Back to Dashboard</Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="container crud-container">
          {message && <div className="message success">{message}</div>}

          <div className="list-section">
            <div className="crud-header">
              <h2>All Testimonials ({testimonials.length})</h2>
            </div>

            {/* Status Filter Bar */}
            <div className="status-filter-bar">
              <button
                className={`status-filter-btn${statusFilter === 'all' ? ' active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All <span className="filter-count">{testimonials.length}</span>
              </button>
              <button
                className={`status-filter-btn status-filter-pending${statusFilter === 'pending' ? ' active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending{' '}<span className="filter-count">{pendingTestimonials.length}</span>
              </button>
              <button
                className={`status-filter-btn status-filter-approved${statusFilter === 'approved' ? ' active' : ''}`}
                onClick={() => setStatusFilter('approved')}
              >
                Approved{' '}<span className="filter-count">{approvedTestimonials.length}</span>
              </button>
            </div>

            {/* Pending Testimonials Section */}
            {(statusFilter === 'all' || statusFilter === 'pending') && pendingTestimonials.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="testimonial-group-title">
                  Pending Review{' '}
                  <span className="testimonial-group-count">{pendingTestimonials.length}</span>
                </h3>
                <div className="testimonial-cards-list">
                  {pendingTestimonials.map((t) => renderTestimonialCard(t, 'pending'))}
                </div>
              </div>
            )}

            {/* Approved Testimonials Section */}
            {(statusFilter === 'all' || statusFilter === 'approved') && approvedTestimonials.length > 0 && (
              <div>
                <h3 className="testimonial-group-title">
                  Approved{' '}
                  <span className="testimonial-group-count">{approvedTestimonials.length}</span>
                </h3>
                <div className="testimonial-cards-list">
                  {approvedTestimonials.map((t) => renderTestimonialCard(t, 'approved'))}
                </div>
              </div>
            )}

            {testimonials.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No testimonials yet. Add one or wait for submissions!
              </p>
            )}

            {statusFilter === 'pending' && pendingTestimonials.length === 0 && testimonials.length > 0 && (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No pending testimonials.
              </p>
            )}

            {statusFilter === 'approved' && approvedTestimonials.length === 0 && testimonials.length > 0 && (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No approved testimonials.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTestimonials;
