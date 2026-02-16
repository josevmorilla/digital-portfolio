import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { contactMessagesAPI } from '../../services/api';
import './Contact.css';

const Contact = () => {
  const { language, toggleLanguage } = useLanguage();
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [message, setMessage] = useState('');

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
          
          <p className="contact-intro">
            {t(
              'Have a question or want to work together? Send me a message!',
              'Vous avez une question ou souhaitez travailler ensemble ? Envoyez-moi un message !'
            )}
          </p>

          <div className="testimonial-banner">
            <p>
              {t(
                '💬 Want to share your experience working with me? Visit the home page to leave a testimonial!',
                '💬 Vous souhaitez partager votre expérience de collaboration ? Visitez la page d\'accueil pour laisser un témoignage !'
              )}
            </p>
          </div>

          {message && <div className="message success">{message}</div>}

          <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">{t('Name', 'Nom')} *</label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">{t('Email', 'Email')} *</label>
                <input
                  id="contact-email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">{t('Subject', 'Sujet')}</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">{t('Message', 'Message')} *</label>
                <textarea
                  id="contact-message"
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

            <Link to="/" className="back-link">
              ← {t('Back to Home', 'Retour à l\'Accueil')}
            </Link>
          </div>
        </section>
      </div>
    );
  };

export default Contact;
