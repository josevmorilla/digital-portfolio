import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { testimonialsAPI, getUploadUrl } from '../../services/api';
import './Testimonials.css';

const Testimonials = () => {
  const { language, toggleLanguage } = useLanguage();
  const [formData, setFormData] = useState({ 
    name: '', 
    position: '', 
    company: '', 
    content: '' 
  });
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const t = (en, fr) => (language === 'en' ? en : fr);

  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll();
      setApprovedTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await testimonialsAPI.create(formData);
      setMessage(t(
        'Thank you for your testimonial! It will be published after review.',
        'Merci pour votre témoignage ! Il sera publié après examen.'
      ));
      setFormData({ name: '', position: '', company: '', content: '' });
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      const errMsg = error.response?.data?.error;
      setMessage(errMsg || t(
        'Error submitting testimonial. Please try again.',
        'Erreur lors de la soumission du témoignage. Veuillez réessayer.'
      ));
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="testimonials-page">
      {/* Toast popup for success/error messages */}
      {message && (
        <div className={`toast-popup ${message.includes('Error') || message.includes('Erreur') || message.includes('Too many') ? 'error' : 'success'}`}>
          <div className="toast-content">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{message}</span>
            <button className="toast-close" onClick={() => setMessage('')}>×</button>
          </div>
        </div>
      )}

      <header className="header">
        <div className="container">
          <nav className="nav">
            <h1 className="logo">{t('Portfolio', 'Portfolio')}</h1>
            <div className="nav-links">
              <Link to="/">{t('Home', 'Accueil')}</Link>
              <Link to="/contact">{t('Contact', 'Contact')}</Link>
              <button onClick={toggleLanguage} className="lang-btn">
                {language === 'en' ? 'FR' : 'EN'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="testimonials-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {t('Share Your Experience', 'Partagez Votre Expérience')}
            </h1>
            <p className="hero-subtitle">
              {t(
                'Your feedback helps others understand the value of our collaboration',
                'Vos commentaires aident les autres à comprendre la valeur de notre collaboration'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Submission Form Section */}
      <section className="testimonial-form-section">
        <div className="container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>{t('Write Your Testimonial', 'Rédigez Votre Témoignage')}</h2>
              <p>
                {t(
                  'Share your thoughts about working with me. Your testimonial will be reviewed before being published.',
                  'Partagez vos impressions sur notre collaboration. Votre témoignage sera examiné avant d\'être publié.'
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="testimonial-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    {t('Your Name', 'Votre Nom')} <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('John Doe', 'Jean Dupont')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="position">
                    {t('Your Position', 'Votre Poste')} <span className="required">*</span>
                  </label>
                  <input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder={t('Software Engineer', 'Ingénieur Logiciel')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="company">
                  {t('Company / Organization', 'Entreprise / Organisation')} 
                  <span className="optional">({t('Optional', 'Optionnel')})</span>
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder={t('Tech Corp Inc.', 'Tech Corp Inc.')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">
                  {t('Your Testimonial', 'Votre Témoignage')} <span className="required">*</span>
                </label>
                <textarea
                  id="content"
                  rows="6"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={t(
                    'Share your experience working with me, the quality of work delivered, communication, etc.',
                    'Partagez votre expérience de collaboration, la qualité du travail livré, la communication, etc.'
                  )}
                  required
                ></textarea>
                <span className="char-count">
                  {formData.content.length} {t('characters', 'caractères')}
                </span>
              </div>

              <div className="form-footer">
                <p className="privacy-note">
                  {t(
                    '🔒 Your information will be reviewed before being published on the website.',
                    '🔒 Vos informations seront examinées avant d\'être publiées sur le site.'
                  )}
                </p>
                <button type="submit" className="submit-btn">
                  {t('Submit Testimonial', 'Soumettre le Témoignage')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Showcase Approved Testimonials */}
      {!loading && approvedTestimonials.length > 0 && (
        <section className="testimonials-showcase">
          <div className="container">
            <h2 className="showcase-title">
              {t('What Others Are Saying', 'Ce Que Les Autres Disent')}
            </h2>
            <div className="testimonials-grid">
              {approvedTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="quote-icon">"</div>
                  <p className="testimonial-content">{testimonial.content}</p>
                  <div className="testimonial-author">
                    {testimonial.imageUrl && (
                      <img 
                        src={getUploadUrl(testimonial.imageUrl)} 
                        alt={testimonial.name}
                        className="author-image"
                      />
                    )}
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>
                        {testimonial.position}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="testimonials-footer">
        <div className="container">
          <p>
            {t(
              'Need to get in touch for something else?',
              'Besoin de me contacter pour autre chose ?'
            )}{' '}
            <Link to="/contact">
              {t('Visit the contact page', 'Visitez la page de contact')}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Testimonials;
