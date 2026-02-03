import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { FiMail, FiMapPin, FiGithub, FiLinkedin } from 'react-icons/fi';
import 'devicon/devicon.min.css';
import {
  skillsAPI,
  projectsAPI,
  workExperienceAPI,
  educationAPI,
  contactInfoAPI,
  contactMessagesAPI,
  hobbiesAPI,
  testimonialsAPI,
  resumesAPI,
} from '../../services/api';
import './Home.css';

const Home = () => {
  const { language, toggleLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    skills: [],
    projects: [],
    workExperience: [],
    education: [],
    contactInfo: [],
    hobbies: [],
    testimonials: [],
  });
  const [resumeEn, setResumeEn] = useState(null);
  const [resumeFr, setResumeFr] = useState(null);
  const [skillsCarouselIndex, setSkillsCarouselIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        skillsRes,
        projectsRes,
        workExpRes,
        educationRes,
        contactRes,
        hobbiesRes,
        testimonialsRes,
      ] = await Promise.all([
        skillsAPI.getAll(),
        projectsAPI.getAll(),
        workExperienceAPI.getAll(),
        educationAPI.getAll(),
        contactInfoAPI.getAll(),
        hobbiesAPI.getAll(),
        testimonialsAPI.getAll(),
      ]);

      setData({
        skills: skillsRes.data,
        projects: projectsRes.data,
        workExperience: workExpRes.data,
        education: educationRes.data,
        contactInfo: contactRes.data,
        hobbies: hobbiesRes.data,
        testimonials: testimonialsRes.data,
      });

      // Fetch both English and French resumes
      try {
        const [enRes, frRes] = await Promise.all([
          resumesAPI.getCurrentByLanguage('en').catch(() => null),
          resumesAPI.getCurrentByLanguage('fr').catch(() => null),
        ]);
        setResumeEn(enRes?.data || null);
        setResumeFr(frRes?.data || null);
      } catch (error) {
        console.log('No resume available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = (en, fr) => (language === 'en' ? en : fr);

  // Devicon class mapping for skills
  const skillIconMap = {
    JavaScript: 'javascript',
    TypeScript: 'typescript',
    Python: 'python',
    Java: 'java',
    Kotlin: 'kotlin',
    'C#': 'csharp',
    'C++': 'cplusplus',
    'C': 'c',
    PHP: 'php',
    Ruby: 'ruby',
    Go: 'go',
    Rust: 'rust',
    Swift: 'swift',
    'HTML/CSS': 'html5',
    HTML: 'html5',
    CSS: 'css3',
    React: 'react',
    Vue: 'vuejs',
    Angular: 'angularjs',
    Svelte: 'svelte',
    'Next.js': 'nextjs',
    Express: 'express',
    Django: 'django',
    'Spring Boot': 'spring',
    'Node.js': 'nodejs',
    PostgreSQL: 'postgresql',
    MongoDB: 'mongodb',
    MySQL: 'mysql',
    SQL: 'postgresql',
    Redis: 'redis',
    Firebase: 'firebase',
    Docker: 'docker',
    Git: 'git',
    'Git & GitHub': 'github',
    GitHub: 'github',
    GitLab: 'gitlab',
    Bitbucket: 'bitbucket',
    Linux: 'linux',
    Windows: 'windows8',
    MacOS: 'apple',
    'Android Studio': 'android',
    'VS Code': 'vscode',
    AWS: 'amazonwebservices',
    Azure: 'azure',
    'Google Cloud': 'googlecloud',
    Kubernetes: 'kubernetes',
    Jest: 'jest',
    JUnit: 'java',
    Mocha: 'mocha',
    MockWebServer: 'docker',
    Cypress: 'cypress',
    Webpack: 'webpack',
    Vite: 'vitejs',
    Gulp: 'gulp',
    Tailwind: 'tailwindcss',
    Bootstrap: 'bootstrap',
    'Material UI': 'materialui',
    Sass: 'sass',
    Swagger: 'swagger',
    Postman: 'postman',
    Figma: 'figma',
  };

  // Consolidated category mapping
  const categoryMap = {
    Languages: 'Programming',
    Frontend: 'Frontend',
    Frameworks: 'Frontend',
    Backend: 'Backend',
    Databases: 'Databases',
    Tools: 'Tools',
    Testing: 'Tools',
    Cloud: 'Tools',
    Other: 'Other',
  };

  const categoryLabels = {
    Programming: t('Programming Languages', 'Langages de Programmation'),
    Frontend: t('Frontend', 'Frontend'),
    Backend: t('Backend', 'Backend'),
    Databases: t('Databases', 'Bases de données'),
    Tools: t('Tools & DevOps', 'Outils et DevOps'),
    Other: t('Other', 'Autres'),
  };

  // Get flat list of all skills for carousel
  const allSkills = data.skills.map(skill => ({
    ...skill,
    displayName: language === 'en' ? skill.nameEn : skill.nameFr,
  }));

  const skillsPerSlide = 6;
  const totalSlides = Math.ceil(allSkills.length / skillsPerSlide);
  const currentSlide = Math.min(skillsCarouselIndex, totalSlides - 1);
  const startIndex = currentSlide * skillsPerSlide;
  const visibleSkills = allSkills.slice(startIndex, startIndex + skillsPerSlide);

  // Auto-advance skills carousel
  useEffect(() => {
    if (totalSlides <= 1) return;
    const id = setInterval(() => {
      setSkillsCarouselIndex(prev => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(id);
  }, [totalSlides]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleSkillsPrev = () => {
    setSkillsCarouselIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleSkillsNext = () => {
    setSkillsCarouselIndex(prev => (prev + 1) % totalSlides);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactMessagesAPI.create(contactForm);
      setContactMessage(t('Message sent successfully!', 'Message envoyé avec succès !'));
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setContactMessage(''), 3000);
    } catch (error) {
      setContactMessage(t('Error sending message', 'Erreur lors de l\'envoi du message'));
    }
  };

  const getSkillIcon = (skillName) => {
    const iconName = skillIconMap[skillName];
    if (iconName) {
      return <i className={`devicon-${iconName}-plain`}></i>;
    }
    return null;
  };

  const contactIcon = {
    email: <FiMail />,
    location: <FiMapPin />,
    github: <FiGithub />,
    linkedin: <FiLinkedin />,
  };

  const contactHref = (info) => {
    if (info.type === 'email') return `mailto:${info.value}`;
    if (info.type === 'github' || info.type === 'linkedin') return info.value;
    return null;
  };

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <h1 className="logo">Jose Villegas</h1>
            <div className="nav-links">
              <a href="#skills">{t('Skills', 'Compétences')}</a>
              <a href="#projects">{t('Projects', 'Projets')}</a>
              <a href="#experience">{t('Experience', 'Expérience')}</a>
              <a href="#education">{t('Education', 'Éducation')}</a>
              <a href="#hobbies">{t('Hobbies', 'Loisirs')}</a>
              <a href="#testimonials">{t('Testimonials', 'Témoignages')}</a>
              <a href="#contact-form">{t('Get in Touch', 'Contactez-moi')}</a>
              <button onClick={toggleLanguage} className="lang-btn">
                {language === 'en' ? 'FR' : 'EN'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Jose Villegas</h1>
          <p className="hero-subtitle">
            {t(
              'Full Stack Developer & Digital Creator',
              'Développeur full stack et créateur digital'
            )}
          </p>
          <div className="hero-contact-icons">
            {data.contactInfo
              .filter((info) => ['email', 'github', 'linkedin', 'location'].includes(info.type))
              .map((info) => (
                <a
                  key={info.id}
                  href={contactHref(info) || '#'}
                  target={contactHref(info) && info.type !== 'location' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  aria-label={info.label}
                >
                  {contactIcon[info.type] || <FiMapPin />}
                </a>
              ))}
          </div>
          <div className="cv-download-buttons">
            <a
              href={resumeEn ? resumesAPI.download(resumeEn.id) : '#'}
              download={resumeEn ? true : false}
              className="btn-download"
              style={!resumeEn ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              {t('Download CV (English)', 'Télécharger CV (Anglais)')}
            </a>
            <a
              href={resumeFr ? resumesAPI.download(resumeFr.id) : '#'}
              download={resumeFr ? true : false}
              className="btn-download"
              style={!resumeFr ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              {t('Download CV (French)', 'Télécharger CV (Français)')}
            </a>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <div className="container">
          <h2 className="section-title">{t('Skills', 'Compétences')}</h2>
          <div className="skills-carousel-container">
            <button 
              className="carousel-btn carousel-btn-prev" 
              onClick={handleSkillsPrev}
              aria-label="Previous skills"
            >
              ←
            </button>
            
            <div className="skills-carousel">
              <div className="skills-carousel-track">
                {visibleSkills.map((skill) => (
                  <div key={skill.id} className="skill-card-carousel">
                    <div className="skill-icon-wrapper-carousel">
                      {getSkillIcon(skill.displayName)}
                    </div>
                    <h4>{skill.displayName}</h4>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="carousel-btn carousel-btn-next" 
              onClick={handleSkillsNext}
              aria-label="Next skills"
            >
              →
            </button>
          </div>

          <div className="carousel-indicators">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setSkillsCarouselIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section bg-light">
        <div className="container">
          <h2 className="section-title">{t('Projects', 'Projets')}</h2>
          
          {/* Featured Projects - Large Alternating Layout */}
          <div className="projects-showcase">
            {data.projects
              .filter(project => project.featured)
              .map((project, index) => (
                <div key={project.id} className={`project-showcase-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                  {/* Image */}
                  <div className="project-showcase-image">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={language === 'en' ? project.titleEn : project.titleFr} />
                    ) : (
                      <div className="project-placeholder">
                        <FiGithub size={64} />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="project-showcase-content">
                    <h3>{language === 'en' ? project.titleEn : project.titleFr}</h3>
                    <p className="project-date">
                      {project.startDate ? (
                        project.endDate ? (
                          `${new Date(project.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })} - ${new Date(project.endDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })}`
                        ) : (
                          `${new Date(project.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })} - ${t('Present', 'Présent')}`
                        )
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="project-description">
                      {language === 'en' ? project.descriptionEn : project.descriptionFr}
                    </p>
                    <div className="project-tech">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-project">
                          <FiGithub /> {t('GitHub', 'GitHub')}
                        </a>
                      )}
                      {project.projectUrl && (
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="btn-project">
                          {t('View Live', 'Voir en ligne')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Other Projects - Smaller Grid */}
          {data.projects.filter(project => !project.featured).length > 0 && (
            <div className="other-projects-section">
              <h3 className="other-projects-title">{t('Other Projects', 'Autres Projets')}</h3>
              <div className="projects-grid">
                {data.projects
                  .filter(project => !project.featured)
                  .map((project) => (
                    <div key={project.id} className="project-card">
                      <h3>{language === 'en' ? project.titleEn : project.titleFr}</h3>
                      <p className="project-card-date">
                        {project.startDate ? (
                          project.endDate ? (
                            `${new Date(project.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })} - ${new Date(project.endDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })}`
                          ) : (
                            `${new Date(project.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })} - ${t('Present', 'Présent')}`
                          )
                        ) : (
                          ''
                        )}
                      </p>
                      <p>{language === 'en' ? project.descriptionEn : project.descriptionFr}</p>
                      <div className="project-tech">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      <div className="project-links">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <FiGithub /> GitHub
                          </a>
                        )}
                        {project.projectUrl && (
                          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                            {t('View Live', 'Voir en ligne')}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="section">
        <div className="container">
          <h2 className="section-title">{t('Work Experience', 'Expérience Professionnelle')}</h2>
          <div className="timeline">
            {data.workExperience.map((exp) => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-date">
                  {new Date(exp.startDate).getFullYear()} -{' '}
                  {exp.current ? t('Present', 'Présent') : new Date(exp.endDate).getFullYear()}
                </div>
                <div className="timeline-content">
                  <h3>{language === 'en' ? exp.positionEn : exp.positionFr}</h3>
                  <h4>{language === 'en' ? exp.companyEn : exp.companyFr}</h4>
                  <p>{language === 'en' ? exp.descriptionEn : exp.descriptionFr}</p>
                  {exp.location && <span className="location">{exp.location}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="section bg-light">
        <div className="container">
          <h2 className="section-title">{t('Education', 'Éducation')}</h2>
          <div className="timeline">
            {data.education.map((edu) => (
              <div key={edu.id} className="timeline-item">
                <div className="timeline-date">
                  {new Date(edu.startDate).getFullYear()} -{' '}
                  {edu.current ? t('Present', 'Présent') : new Date(edu.endDate).getFullYear()}
                </div>
                <div className="timeline-content">
                  <h3>{language === 'en' ? edu.degreeEn : edu.degreeFr}</h3>
                  <h4>{language === 'en' ? edu.institutionEn : edu.institutionFr}</h4>
                  <p>{language === 'en' ? edu.fieldEn : edu.fieldFr}</p>
                  {edu.gpa && <span className="gpa">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section id="hobbies" className="section">
        <div className="container">
          <h2 className="section-title">{t('Hobbies & Interests', 'Loisirs et Intérêts')}</h2>
          
          {/* Featured Hobbies - Project-style Layout */}
          {data.hobbies.some(hobby => hobby.featured) && (
            <div className="projects-showcase">
              {data.hobbies
                .filter(hobby => hobby.featured)
                .map((hobby, index) => (
                  <div key={hobby.id} className={`project-showcase-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                    {/* Image */}
                    <div className="project-showcase-image">
                      {hobby.imageUrl ? (
                        <img src={hobby.imageUrl} alt={language === 'en' ? hobby.nameEn : hobby.nameFr} />
                      ) : (
                        <div className="project-placeholder">
                          <FiGithub size={64} />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="project-showcase-content">
                      <h3>{language === 'en' ? hobby.nameEn : hobby.nameFr}</h3>
                      <p className="project-date">
                        {hobby.startDate && (
                          hobby.endDate ? (
                            `${new Date(hobby.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })} - ${new Date(hobby.endDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })}`
                          ) : (
                            `${new Date(hobby.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'short' })} - ${t('Present', 'Présent')}`
                          )
                        )}
                      </p>
                      <p className="project-description">
                        {language === 'en' ? hobby.descriptionEn : hobby.descriptionFr}
                      </p>
                      {hobby.technologies && hobby.technologies.length > 0 && (
                        <div className="project-tech">
                          {hobby.technologies.map((tech, idx) => (
                            <span key={idx} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      )}
                      {hobby.links && hobby.links.length > 0 && (
                        <div className="project-links">
                          {hobby.links.map((link, idx) => (
                            <a 
                              key={idx} 
                              href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn-project"
                            >
                              {link.label.toLowerCase().includes('github') ? <FiGithub /> : null}
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          {/* Regular Hobbies Grid */}
          {data.hobbies.some(hobby => !hobby.featured) && (
            <div className="hobbies-grid">
              {data.hobbies
                .filter(hobby => !hobby.featured)
                .map((hobby) => (
                  <div key={hobby.id} className="hobby-card">
                    <h3>{language === 'en' ? hobby.nameEn : hobby.nameFr}</h3>
                    {hobby.descriptionEn && (
                      <p>{language === 'en' ? hobby.descriptionEn : hobby.descriptionFr}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section bg-light">
        <div className="container">
          <h2 className="section-title">{t('Testimonials', 'Témoignages')}</h2>
          <div className="testimonials-grid">
            {data.testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.position}</span>
                  {testimonial.company && <span>{testimonial.company}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="section bg-light">
        <div className="container">
          <h2 className="section-title">{t('Get in Touch', 'Contactez-moi')}</h2>
          
          {contactMessage && (
            <div className={`contact-message ${contactMessage.includes('successfully') ? 'success' : 'error'}`}>
              {contactMessage}
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-group">
              <label>{t('Name', 'Nom')} *</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                placeholder={t('Your name', 'Votre nom')}
              />
            </div>

            <div className="form-group">
              <label>{t('Email', 'Email')} *</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                placeholder={t('your.email@example.com', 'votre.email@exemple.com')}
              />
            </div>

            <div className="form-group">
              <label>{t('Subject', 'Sujet')}</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder={t('Message subject', 'Sujet du message')}
              />
            </div>

            <div className="form-group">
              <label>{t('Message', 'Message')} *</label>
              <textarea
                rows="5"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                placeholder={t('Your message...', 'Votre message...')}
              ></textarea>
            </div>

            <button type="submit" className="btn-submit">
              {t('Send Message', 'Envoyer le Message')}
            </button>
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
      <section id="contact-section" className="section">
        <div className="container">
          <h2 className="section-title">{t('Contact Information', 'Informations de Contact')}</h2>
          <div className="contact-info-grid">
            {data.contactInfo.map((info) => (
              <div key={info.id} className="contact-info-item">
                <div className="contact-icon">{contactIcon[info.type] || <FiMapPin />}</div>
                <div className="contact-body">
                  <span className="contact-label">{info.label}</span>
                  {contactHref(info) ? (
                    <a href={contactHref(info)} target={info.type === 'location' ? '_self' : '_blank'} rel="noopener noreferrer">
                      {info.value}
                    </a>
                  ) : (
                    <span>{info.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Jose Villegas</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
