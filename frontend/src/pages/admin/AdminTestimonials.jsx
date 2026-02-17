import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testimonialsAPI } from '../../services/api';
import './AdminCrud.css';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
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

            {/* Pending Testimonials Section */}
            {pendingTestimonials.length > 0 && (
              <div className="pending-section" style={{ marginBottom: '2rem' }}>
                <div className="section-header" style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>
                    ⏳ Pending Approval ({pendingTestimonials.length})
                  </h3>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    Review Required
                  </span>
                </div>
                <div className="items-list">
                  {pendingTestimonials.map((testimonial) => {
                    const parsed = parseTestimonialContent(testimonial.content);
                    return (
                      <div key={testimonial.id} className="item-card testimonial-detailed" style={{ borderLeft: '4px solid #fbbf24' }}>
                        <div className="item-header">
                          <h3>{testimonial.name}</h3>
                          <span className="badge" style={{background: '#fbbf24', fontWeight: '700'}}>
                            Pending ⚠️
                          </span>
                        </div>
                        <p className="item-meta">
                          {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                        </p>
                        
                        {parsed.isStructured ? (
                          <div className="testimonial-structured">
                            {/* Ratings Display */}
                            {Object.keys(parsed.ratings).length > 0 && (
                              <div className="ratings-grid">
                                {parsed.ratings.technicalExpertise && (
                                  <div className="rating-item">
                                    <span className="rating-label">Technical:</span>
                                    {renderStars(parsed.ratings.technicalExpertise)}
                                    <span className="rating-value">{parsed.ratings.technicalExpertise}/5</span>
                                  </div>
                                )}
                                {parsed.ratings.codeQuality && (
                                  <div className="rating-item">
                                    <span className="rating-label">Code Quality:</span>
                                    {renderStars(parsed.ratings.codeQuality)}
                                    <span className="rating-value">{parsed.ratings.codeQuality}/5</span>
                                  </div>
                                )}
                                {parsed.ratings.communication && (
                                  <div className="rating-item">
                                    <span className="rating-label">Communication:</span>
                                    {renderStars(parsed.ratings.communication)}
                                    <span className="rating-value">{parsed.ratings.communication}/5</span>
                                  </div>
                                )}
                                {parsed.ratings.deadlines && (
                                  <div className="rating-item">
                                    <span className="rating-label">Deadlines:</span>
                                    {renderStars(parsed.ratings.deadlines)}
                                    <span className="rating-value">{parsed.ratings.deadlines}/5</span>
                                  </div>
                                )}
                                {parsed.ratings.overall && (
                                  <div className="rating-item">
                                    <span className="rating-label">Overall:</span>
                                    {renderStars(parsed.ratings.overall)}
                                    <span className="rating-value">{parsed.ratings.overall}/5</span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Feedback Preview */}
                            {parsed.feedback.problemResults && (
                              <div className="feedback-preview">
                                <strong>Problem & Results:</strong>
                                <p>{parsed.feedback.problemResults.substring(0, 200)}...</p>
                              </div>
                            )}
                            
                            {parsed.feedback.bestPart && (
                              <div className="feedback-preview">
                                <strong>Best Part:</strong>
                                <p>{parsed.feedback.bestPart.substring(0, 150)}...</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="item-meta" style={{fontStyle: 'italic', marginTop: '0.5rem'}}>
                            "{testimonial.content.substring(0, 150)}..."
                          </p>
                        )}
                        
                        <div className="item-actions">
                        <button 
                          onClick={() => handleApprove(testimonial.id)} 
                          className="approve-btn"
                          style={{
                            background: '#10b981',
                            color: 'white',
                            fontWeight: '600'
                          }}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          onClick={() => handleReject(testimonial.id)} 
                          className="delete-btn"
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            fontWeight: '600'
                          }}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}

            {/* Approved Testimonials Section */}
            {approvedTestimonials.length > 0 && (
              <div className="approved-section">
                <div className="section-header" style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>
                    ✓ Approved Testimonials ({approvedTestimonials.length})
                  </h3>
                </div>
                <div className="items-list">
                  {approvedTestimonials.map((testimonial) => {
                    const parsed = parseTestimonialContent(testimonial.content);
                    return (
                      <div key={testimonial.id} className="item-card testimonial-detailed" style={{ borderLeft: '4px solid #10b981' }}>
                        <div className="item-header">
                          <h3>{testimonial.name}</h3>
                          <span className="badge" style={{background: '#10b981'}}>Approved</span>
                        </div>
                        <p className="item-meta">
                          {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                        </p>
                        
                        {parsed.isStructured ? (
                          <div className="testimonial-structured">
                            {/* Ratings Display */}
                            {Object.keys(parsed.ratings).length > 0 && (
                              <div className="ratings-grid">
                                {parsed.ratings.technicalExpertise && (
                                  <div className="rating-item">
                                    <span className="rating-label">Technical:</span>
                                    {renderStars(parsed.ratings.technicalExpertise)}
                                    <span className="rating-value">{parsed.ratings.technicalExpertise}/5</span>
                                  </div>
                                )}
                                {parsed.ratings.codeQuality && (
                                  <div className="rating-item">
                                    <span className="rating-label">Code Quality:</span>
                                    {renderStars(parsed.ratings.codeQuality)}
                                    <span className="rating-value">{parsed.ratings.codeQuality}/5</span>
                                  </div>
                                )}
                                {parsed.ratings.communication && (
                                  <div className="rating-item">
                                    <span className="rating-label">Communication:</span>
                                    {renderStars(parsed.ratings.communication)}
                                    <span className="rating-value">{parsed.ratings.communication}/5</span>
                                  </div>
                                )}
                                {parsed.ratings.deadlines && (
                                  <div className="rating-item">
                                    <span className="rating-label">Deadlines:</span>
                                    {renderStars(parsed.ratings.deadlines)}
                                    <span className="rating-value">{parsed.ratings.deadlines}/5</span>
                                  </div>
                                )}
                                {parsed.ratings.overall && (
                                  <div className="rating-item">
                                    <span className="rating-label">Overall:</span>
                                    {renderStars(parsed.ratings.overall)}
                                    <span className="rating-value">{parsed.ratings.overall}/5</span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Feedback Preview */}
                            {parsed.feedback.problemResults && (
                              <div className="feedback-preview">
                                <strong>Problem & Results:</strong>
                                <p>{parsed.feedback.problemResults.substring(0, 200)}...</p>
                              </div>
                            )}
                            
                            {parsed.feedback.bestPart && (
                              <div className="feedback-preview">
                                <strong>Best Part:</strong>
                                <p>{parsed.feedback.bestPart.substring(0, 150)}...</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="item-meta" style={{fontStyle: 'italic', marginTop: '0.5rem'}}>
                            "{testimonial.content.substring(0, 150)}..."
                          </p>
                        )}
                        
                        <div className="item-actions">
                        <button onClick={() => handleUnapprove(testimonial)} className="secondary">
                          Unapprove
                        </button>
                        <button onClick={() => handleDelete(testimonial.id)} className="delete-btn">
                          Delete
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {testimonials.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No testimonials yet. Add one or wait for submissions!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTestimonials;
