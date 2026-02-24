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
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
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
      setMessage('Error approving testimonial');
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
      setMessage('Error unapproving testimonial');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this testimonial? It will be permanently removed.')) return;
    
    try {
      await testimonialsAPI.reject(id);
      setMessage('Testimonial rejected and removed successfully!');
      fetchTestimonials();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error rejecting testimonial');
    }
  };

  // Parse structured testimonial content
  const parseTestimonialContent = (content) => {
    const ratings = {};
    const feedback = {};
    
    // Extract ratings
    const ratingMatches = content.match(/Technical Expertise: (\d+)\/5/i);
    if (ratingMatches) ratings.technicalExpertise = ratingMatches[1];
    
    const codeQualityMatches = content.match(/Code Quality: (\d+)\/5/i);
    if (codeQualityMatches) ratings.codeQuality = codeQualityMatches[1];
    
    const communicationMatches = content.match(/Communication: (\d+)\/5/i);
    if (communicationMatches) ratings.communication = communicationMatches[1];
    
    const deadlinesMatches = content.match(/Meeting Deadlines: (\d+)\/5/i);
    if (deadlinesMatches) ratings.deadlines = deadlinesMatches[1];
    
    const overallMatches = content.match(/Overall Satisfaction: (\d+)\/5/i);
    if (overallMatches) ratings.overall = overallMatches[1];
    
    // Extract feedback sections
    const problemMatch = content.match(/Problem & Results:\s*\n([\s\S]*?)(?:\n\n|Doubts Overcome:)/i);
    if (problemMatch) feedback.problemResults = problemMatch[1].trim();
    
    const doubtsMatch = content.match(/Doubts Overcome:\s*\n([\s\S]*?)(?:\n\n|Best Part:)/i);
    if (doubtsMatch) feedback.doubtsOvercome = doubtsMatch[1].trim();
    
    const bestPartMatch = content.match(/Best Part:\s*\n([\s\S]*?)(?:\n\n|Would Recommend:)/i);
    if (bestPartMatch) feedback.bestPart = bestPartMatch[1].trim();
    
    const recommendMatch = content.match(/Would Recommend:\s*\n([\s\S]*?)$/i);
    if (recommendMatch) feedback.wouldRecommend = recommendMatch[1].trim();
    
    return { ratings, feedback, isStructured: Object.keys(ratings).length > 0 };
  };

  const renderStars = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>
            ★
          </span>
        ))}
      </div>
    );
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
    const parsed = parseTestimonialContent(testimonial.content);

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

        {/* Section 1: General Information */}
        <div className="testimonial-section">
          <h4 className="testimonial-section-title">1. General Information</h4>
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
                <span className="field-label">Project Name</span>
                <span className="field-value">{testimonial.position}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Core Evaluation */}
        {parsed.isStructured && Object.keys(parsed.ratings).length > 0 && (
          <div className="testimonial-section">
            <h4 className="testimonial-section-title">2. Core Evaluation</h4>
            <div className="testimonial-ratings">
              {parsed.ratings.technicalExpertise && (
                <div className="rating-row">
                  <span className="rating-question">Technical expertise?</span>
                  <div className="rating-answer">
                    {renderStars(parsed.ratings.technicalExpertise)}
                    <span className="rating-num">{parsed.ratings.technicalExpertise}/5</span>
                  </div>
                </div>
              )}
              {parsed.ratings.codeQuality && (
                <div className="rating-row">
                  <span className="rating-question">Quality of code/deliverables?</span>
                  <div className="rating-answer">
                    {renderStars(parsed.ratings.codeQuality)}
                    <span className="rating-num">{parsed.ratings.codeQuality}/5</span>
                  </div>
                </div>
              )}
              {parsed.ratings.communication && (
                <div className="rating-row">
                  <span className="rating-question">Communication effectiveness?</span>
                  <div className="rating-answer">
                    {renderStars(parsed.ratings.communication)}
                    <span className="rating-num">{parsed.ratings.communication}/5</span>
                  </div>
                </div>
              )}
              {parsed.ratings.deadlines && (
                <div className="rating-row">
                  <span className="rating-question">Meeting deadlines/milestones?</span>
                  <div className="rating-answer">
                    {renderStars(parsed.ratings.deadlines)}
                    <span className="rating-num">{parsed.ratings.deadlines}/5</span>
                  </div>
                </div>
              )}
              {parsed.ratings.overall && (
                <div className="rating-row">
                  <span className="rating-question">Overall satisfaction?</span>
                  <div className="rating-answer">
                    {renderStars(parsed.ratings.overall)}
                    <span className="rating-num">{parsed.ratings.overall}/5</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 3: Qualitative Feedback */}
        {parsed.isStructured ? (
          <div className="testimonial-section">
            <h4 className="testimonial-section-title">3. Qualitative Feedback</h4>
            <div className="testimonial-feedback">
              {parsed.feedback.problemResults && (
                <div className="feedback-block">
                  <span className="feedback-question">What problem were you facing, and what specific results did the developer deliver?</span>
                  <p className="feedback-answer">{parsed.feedback.problemResults}</p>
                </div>
              )}
              {parsed.feedback.doubtsOvercome && (
                <div className="feedback-block">
                  <span className="feedback-question">What was your biggest doubt when hiring, and how did they overcome it?</span>
                  <p className="feedback-answer">{parsed.feedback.doubtsOvercome}</p>
                </div>
              )}
              {parsed.feedback.bestPart && (
                <div className="feedback-block">
                  <span className="feedback-question">What is the best part about working with this developer?</span>
                  <p className="feedback-answer">{parsed.feedback.bestPart}</p>
                </div>
              )}
              {parsed.feedback.wouldRecommend && (
                <div className="feedback-block">
                  <span className="feedback-question">Would you recommend this developer to a colleague?</span>
                  <p className="feedback-answer">{parsed.feedback.wouldRecommend}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="testimonial-section">
            <h4 className="testimonial-section-title">Testimonial Content</h4>
            <p className="feedback-answer" style={{whiteSpace: 'pre-wrap'}}>{testimonial.content}</p>
          </div>
        )}

        {/* Section 4: Authorization */}
        <div className="testimonial-section">
          <h4 className="testimonial-section-title">4. Authorization</h4>
          <p className="auth-granted">✓ Permission granted to use this testimonial</p>
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
                Pending <span className="filter-count">{pendingTestimonials.length}</span>
              </button>
              <button
                className={`status-filter-btn status-filter-approved${statusFilter === 'approved' ? ' active' : ''}`}
                onClick={() => setStatusFilter('approved')}
              >
                Approved <span className="filter-count">{approvedTestimonials.length}</span>
              </button>
            </div>

            {/* Pending Testimonials Section */}
            {(statusFilter === 'all' || statusFilter === 'pending') && pendingTestimonials.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="testimonial-group-title">
                  Pending Review
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
                  Approved
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
