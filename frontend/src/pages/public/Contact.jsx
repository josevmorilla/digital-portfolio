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

  const t = (en, es) => (language === 'en' ? en : es);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactMessagesAPI.create(contactForm);
      setMessage(t('Message sent successfully!', '¡Mensaje enviado exitosamente!'));
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setMessage(t('Error sending message', 'Error al enviar mensaje'));
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      await testimonialsAPI.create(testimonialForm);
      setMessage(t(
        'Testimonial submitted successfully! It will be visible after admin approval.',
        '¡Testimonio enviado exitosamente! Será visible después de la aprobación del administrador.'
      ));
      setTestimonialForm({ name: '', position: '', company: '', content: '' });
    } catch (error) {
      setMessage(t('Error submitting testimonial', 'Error al enviar testimonio'));
    }
  };

  return (
    <div className="contact-page">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <h1 className="logo">{t('Portfolio', 'Portafolio')}</h1>
            <div className="nav-links">
              <Link to="/">{t('Home', 'Inicio')}</Link>
              <button onClick={toggleLanguage} className="lang-btn">
                {language === 'en' ? 'ES' : 'EN'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section className="contact-section">
        <div className="container">
          <h1>{t('Get in Touch', 'Contáctame')}</h1>
          
          <div className="tabs">
            <button
              className={activeTab === 'contact' ? 'active' : ''}
              onClick={() => setActiveTab('contact')}
            >
              {t('Contact Message', 'Mensaje de Contacto')}
            </button>
            <button
              className={activeTab === 'testimonial' ? 'active' : ''}
              onClick={() => setActiveTab('testimonial')}
            >
              {t('Leave a Testimonial', 'Dejar un Testimonio')}
            </button>
          </div>

          {message && <div className="message success">{message}</div>}

          {activeTab === 'contact' ? (
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('Name', 'Nombre')} *</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('Email', 'Correo Electrónico')} *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('Subject', 'Asunto')}</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{t('Message', 'Mensaje')} *</label>
                <textarea
                  rows="5"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="primary">
                {t('Send Message', 'Enviar Mensaje')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTestimonialSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('Name', 'Nombre')} *</label>
                <input
                  type="text"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('Position', 'Cargo')} *</label>
                <input
                  type="text"
                  value={testimonialForm.position}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, position: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('Company', 'Empresa')}</label>
                <input
                  type="text"
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{t('Testimonial', 'Testimonio')} *</label>
                <textarea
                  rows="5"
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="primary">
                {t('Submit Testimonial', 'Enviar Testimonio')}
              </button>
            </form>
          )}

          <Link to="/" className="back-link">
            ← {t('Back to Home', 'Volver al Inicio')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Contact;
