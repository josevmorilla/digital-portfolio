import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { contactMessagesAPI, testimonialsAPI } from '../../services/api';
import './Contact.css';

const Contact = () => {
  const { language, toggleLanguage } = useLanguage();
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [testimonialForm, setTestimonialForm] = useState({ name: '', position: '', company: '', content: '' });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('contact');

  const t = (en, fr) => (language === 'en' ? en : fr);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactMessagesAPI.create(contactForm);
      setMessage(t('Message sent successfully!', 'Message envoyé avec succès !'));
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setMessage(t('Error sending message', 'Erreur lors de l\'envoi du message'));
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      await testimonialsAPI.create(testimonialForm);
      setMessage(t(
        'Testimonial submitted successfully! It will be visible after admin approval.',
        'Témoignage soumis avec succès ! Il sera visible après approbation de l\'administrateur.'
      ));
      setTestimonialForm({ name: '', position: '', company: '', content: '' });
    } catch (error) {
      setMessage(t('Error submitting testimonial', 'Erreur lors de la soumission du témoignage'));
    }
  };

  return (
    <div className="contact-page">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <h1 className="logo">{t('Portfolio', 'Portfolio')}</h1>
            <div className="nav-links">
              <Link to="/">{t('Home', 'Accueil')}</Link>
              <button onClick={toggleLanguage} className="lang-btn">
                {language === 'en' ? 'FR' : 'EN'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section className="contact-section">
        <div className="container">
          <h1>{t('Get in Touch', 'Contactez-moi')}</h1>
          
          <div className="tabs">
            <button
              className={activeTab === 'contact' ? 'active' : ''}
              onClick={() => setActiveTab('contact')}
            >
              {t('Contact Message', 'Message de Contact')}
            </button>
            <button
              className={activeTab === 'testimonial' ? 'active' : ''}
              onClick={() => setActiveTab('testimonial')}
            >
              {t('Leave a Testimonial', 'Laisser un Témoignage')}
            </button>
          </div>

          {message && <div className="message success">{message}</div>}

          {activeTab === 'contact' ? (
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('Name', 'Nom')} *</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('Email', 'Email')} *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('Subject', 'Sujet')}</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{t('Message', 'Message')} *</label>
                <textarea
                  rows="5"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="primary">
                {t('Send Message', 'Envoyer le Message')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTestimonialSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('Name', 'Nom')} *</label>
                <input
                  type="text"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('Position', 'Poste')} *</label>
                <input
                  type="text"
                  value={testimonialForm.position}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, position: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('Company', 'Entreprise')}</label>
                <input
                  type="text"
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{t('Testimonial', 'Témoignage')} *</label>
                <textarea
                  rows="5"
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="primary">
                {t('Submit Testimonial', 'Soumettre le Témoignage')}
              </button>
            </form>
          )}

          <Link to="/" className="back-link">
            ← {t('Back to Home', 'Retour à l\'Accueil')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Contact;
