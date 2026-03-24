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
  profileAPI,
  categorySettingsAPI,
  getUploadUrl,
} from '../../services/api';
import './Home.css';

const Home = () => {
  const { language, toggleLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState({
    skills: [],
    projects: [],
    workExperience: [],
    education: [],
    contactInfo: [],
    hobbies: [],
    testimonials: [],
  });
  const [profile, setProfile] = useState(null);
  const [resumeEn, setResumeEn] = useState(null);
  const [resumeFr, setResumeFr] = useState(null);
  const [activeSkillTab, setActiveSkillTab] = useState(null);
  const [skillTabIndexes, setSkillTabIndexes] = useState({});
  const [categorySettings, setCategorySettings] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [contactMessage, setContactMessage] = useState('');
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [formLoadedAt, setFormLoadedAt] = useState(Date.now());
  const [testimonialForm, setTestimonialForm] = useState({ 
    name: '', 
    company: '', 
    projectName: '',
    content: '',
    website: ''
  });
  const [testimonialMessage, setTestimonialMessage] = useState('');
  const [testimonialToast, setTestimonialToast] = useState('');

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
        profileRes,
        catSettingsRes,
      ] = await Promise.all([
        skillsAPI.getAll(),
        projectsAPI.getAll(),
        workExperienceAPI.getAll(),
        educationAPI.getAll(),
        contactInfoAPI.getAll(),
        hobbiesAPI.getAll(),
        testimonialsAPI.getAll(),
        profileAPI.get().catch(() => ({ data: null })),
        categorySettingsAPI.getAll().catch(() => ({ data: [] })),
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

      setProfile(profileRes.data);
      setCategorySettings(catSettingsRes.data || []);

      // Fetch both English and French resumes
      await fetchResumes();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const [enRes, frRes] = await Promise.all([
        resumesAPI.getCurrentByLanguage('en').catch(() => null),
        resumesAPI.getCurrentByLanguage('fr').catch(() => null),
      ]);
      setResumeEn(enRes?.data || null);
      setResumeFr(frRes?.data || null);
    } catch {
      console.log('No resume available');
    }
  };

  const t = (en, fr) => (language === 'en' ? en : fr);
  const tf = (obj, enField, frField) => {
    if (!obj) return '';
    return language === 'en' ? obj[enField] : obj[frField];
  };

  const formatDateRange = (startDate, endDate, presentLabel) => {
    if (!startDate) return '';
    const locale = language === 'en' ? 'en-US' : 'fr-FR';
    const options = { year: 'numeric', month: 'short' };
    const start = new Date(startDate).toLocaleDateString(locale, options);
    if (endDate) {
      return `${start} - ${new Date(endDate).toLocaleDateString(locale, options)}`;
    }
    return `${start} - ${presentLabel || t('Present', 'Présent')}`;
  };

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

  // Group skills by category
  const skillsByCategory = {};
  data.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push({
      ...skill,
      displayName: language === 'en' ? skill.nameEn : skill.nameFr,
    });
  });

  // Order categories by their displayOrder from settings
  const orderedCategories = categorySettings
    .filter(cs => skillsByCategory[cs.category])
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Set default active tab on first load
  useEffect(() => {
    if (orderedCategories.length > 0 && !activeSkillTab) {
      setActiveSkillTab(orderedCategories[0].category);
    }
  }, [orderedCategories.length]);

  const skillsPerSlide = 6;

  // Auto-advance carousel for each active tab at its configured speed
  useEffect(() => {
    if (!activeSkillTab) return;
    const setting = categorySettings.find(cs => cs.category === activeSkillTab);
    const speed = setting?.speed || 4000;
    const skills = skillsByCategory[activeSkillTab] || [];
    const total = Math.ceil(skills.length / skillsPerSlide);
    if (total <= 1) return;
    const id = setInterval(() => {
      setSkillTabIndexes(prev => ({
        ...prev,
        [activeSkillTab]: ((prev[activeSkillTab] || 0) + 1) % total,
      }));
    }, speed);
    return () => clearInterval(id);
  }, [activeSkillTab, categorySettings, data.skills.length]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleSkillsPrev = () => {
    if (!activeSkillTab) return;
    const skills = skillsByCategory[activeSkillTab] || [];
    const total = Math.ceil(skills.length / skillsPerSlide);
    setSkillTabIndexes(prev => ({
      ...prev,
      [activeSkillTab]: ((prev[activeSkillTab] || 0) - 1 + total) % total,
    }));
  };

  const handleSkillsNext = () => {
    if (!activeSkillTab) return;
    const skills = skillsByCategory[activeSkillTab] || [];
    const total = Math.ceil(skills.length / skillsPerSlide);
    setSkillTabIndexes(prev => ({
      ...prev,
      [activeSkillTab]: ((prev[activeSkillTab] || 0) + 1) % total,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (Date.now() - formLoadedAt < 3000) {
      setContactMessage(t('Please wait a moment before submitting.', 'Veuillez patienter un instant avant de soumettre.'));
      return;
    }
    try {
      await contactMessagesAPI.create(contactForm);
      setContactMessage(t('Message sent successfully!', 'Message envoyé avec succès !'));
      setContactForm({ name: '', email: '', subject: '', message: '', website: '' });
      setTimeout(() => setContactMessage(''), 3000);
    } catch {
      setContactMessage(t('Error sending message', 'Erreur lors de l\'envoi du message'));
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();

    if (Date.now() - formLoadedAt < 3000) {
      setTestimonialMessage(t('Please wait a moment before submitting.', 'Veuillez patienter un instant avant de soumettre.'));
      return;
    }

    try {
      const submissionData = {
        name: testimonialForm.name || 'Anonymous',
        position: testimonialForm.projectName || 'Client',
        company: testimonialForm.company || null,
        content: testimonialForm.content,
        website: testimonialForm.website || ''
      };

      await testimonialsAPI.create(submissionData);
      setShowTestimonialModal(false);
      setTestimonialMessage('');
      setTestimonialToast(t(
        'Thank you! Your testimonial will be published after review.',
        'Merci ! Votre témoignage sera publié après examen.'
      ));
      setTestimonialForm({ 
        name: '', 
        company: '', 
        projectName: '',
        content: '',
        website: ''
      });
      setTimeout(() => setTestimonialToast(''), 6000);
    } catch (error) {
      const errMsg = error.response?.data?.error;
      setTestimonialMessage(errMsg || t(
        'Error submitting testimonial. Please try again.',
        'Erreur lors de la soumission. Veuillez réessayer.'
      ));
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

  const contactDisplayValue = (info) => {
    if (info.type === 'email') return info.value;
    if (info.type === 'location') return info.value;
    if (info.type === 'linkedin') return 'LinkedIn';
    if (info.type === 'github') return 'GitHub';
    return info.value;
  };

  const isResumeAvailable = (resume) => Boolean(resume);

  const handleDisabledResumeClick = (event, resume) => {
    if (!isResumeAvailable(resume)) {
      event.preventDefault();
    }
  };

  return (
    <div className="home">
      {/* Header */}
      <header className="header" role="banner">
        <div className="container">
          <nav className="nav">
            <button type="button" className="logo" onClick={() => { globalThis.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}>{tf(profile, 'nameEn', 'nameFr')}</button>
            <button 
              className={`hamburger ${mobileMenuOpen ? 'open' : ''}`} 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="primary-navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div id="primary-navigation" className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              <a href="#skills" onClick={() => setMobileMenuOpen(false)}>{t('Skills', 'Compétences')}</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)}>{t('Projects', 'Projets')}</a>
              <a href="#experience" onClick={() => setMobileMenuOpen(false)}>{t('Experience', 'Expérience')}</a>
              <a href="#education" onClick={() => setMobileMenuOpen(false)}>{t('Education', 'Éducation')}</a>
              <a href="#hobbies" onClick={() => setMobileMenuOpen(false)}>{t('Hobbies', 'Loisirs')}</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>{t('Testimonials', 'Témoignages')}</a>
              <a href="#contact-form" onClick={() => setMobileMenuOpen(false)}>{t('Get in Touch', 'Contactez-moi')}</a>
              <button type="button" onClick={toggleLanguage} className="lang-btn" aria-label={t('Switch language', 'Changer de langue')}>
                {language === 'en' ? 'FR' : 'EN'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">{tf(profile, 'nameEn', 'nameFr')}</h1>
          <p className="hero-subtitle">
            {tf(profile, 'titleEn', 'titleFr')}
          </p>
          {profile && (language === 'en' ? profile.bioEn : profile.bioFr) && (
            <p className="hero-bio">
              {language === 'en' ? profile.bioEn : profile.bioFr}
            </p>
          )}
          <div className="hero-contact-icons">
            {data.contactInfo
              .filter((info) => ['email', 'github', 'linkedin'].includes(info.type))
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
              download={!!resumeEn}
              className="btn-download"
              aria-disabled={!resumeEn}
              onClick={(event) => handleDisabledResumeClick(event, resumeEn)}
              style={resumeEn ? {} : { opacity: 0.6, cursor: 'not-allowed' }}
            >
              {t('Download CV (English)', 'Télécharger CV (Anglais)')}
            </a>
            <a
              href={resumeFr ? resumesAPI.download(resumeFr.id) : '#'}
              download={!!resumeFr}
              className="btn-download"
              aria-disabled={!resumeFr}
              onClick={(event) => handleDisabledResumeClick(event, resumeFr)}
              style={resumeFr ? {} : { opacity: 0.6, cursor: 'not-allowed' }}
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

          {/* Category Tabs */}
          {orderedCategories.length > 0 && (
            <div className="skills-tabs" role="tablist" aria-label={t('Skill categories', 'Catégories de compétences')}>
              {orderedCategories.map((cs) => (
                <button
                  key={cs.category}
                  id={`tab-${cs.category}`}
                  className={`skills-tab${activeSkillTab === cs.category ? ' active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeSkillTab === cs.category}
                  aria-controls={`panel-${cs.category}`}
                  onClick={() => { setActiveSkillTab(cs.category); }}
                >
                  {cs.category}
                </button>
              ))}
            </div>
          )}

          {/* Carousel for active tab */}
          {activeSkillTab && skillsByCategory[activeSkillTab] && (() => {
            const tabSkills = skillsByCategory[activeSkillTab];
            const totalSlides = Math.ceil(tabSkills.length / skillsPerSlide);
            const currentSlide = Math.min(skillTabIndexes[activeSkillTab] || 0, totalSlides - 1);
            const startIdx = currentSlide * skillsPerSlide;
            const visible = tabSkills.slice(startIdx, startIdx + skillsPerSlide);

            return (
              <>
                <div className="skills-carousel-container">
                  {totalSlides > 1 && (
                    <button
                      className="carousel-btn carousel-btn-prev"
                      type="button"
                      onClick={handleSkillsPrev}
                      aria-label="Previous skills"
                    >
                      ←
                    </button>
                  )}

                  <div
                    className="skills-carousel"
                    id={`panel-${activeSkillTab}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${activeSkillTab}`}
                  >
                    <div className="skills-carousel-track">
                      {visible.map((skill) => (
                        <div key={skill.id} className="skill-card-carousel">
                          <div className="skill-icon-wrapper-carousel">
                            {getSkillIcon(skill.displayName)}
                          </div>
                          <h3>{skill.displayName}</h3>
                        </div>
                      ))}
                    </div>
                  </div>

                  {totalSlides > 1 && (
                    <button
                      className="carousel-btn carousel-btn-next"
                      type="button"
                      onClick={handleSkillsNext}
                      aria-label="Next skills"
                    >
                      →
                    </button>
                  )}
                </div>

                {totalSlides > 1 && (
                  <div className="carousel-indicators">
                    <span className="carousel-counter">{currentSlide + 1} / {totalSlides}</span>
                  </div>
                )}
              </>
            );
          })()}
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
                      <img
                        src={getUploadUrl(project.imageUrl)}
                        alt={`${language === 'en' ? project.titleEn : project.titleFr} ${t('project preview', 'aperçu du projet')}`}
                        loading="lazy"
                      />
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
                      {formatDateRange(project.startDate, project.endDate)}
                    </p>
                    <p className="project-description">
                      {language === 'en' ? project.descriptionEn : project.descriptionFr}
                    </p>
                    <div className="project-tech">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="tech-tag">{tech}</span>
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
          {data.projects.some(project => !project.featured) && (
            <div className="other-projects-section">
              <h3 className="other-projects-title">{t('Other Projects', 'Autres Projets')}</h3>
              <div className="projects-grid">
                {data.projects
                  .filter(project => !project.featured)
                  .map((project) => (
                    <div key={project.id} className="project-card">
                      <h3>{language === 'en' ? project.titleEn : project.titleFr}</h3>
                      <p className="project-card-date">
                        {formatDateRange(project.startDate, project.endDate)}
                      </p>
                      <p>{language === 'en' ? project.descriptionEn : project.descriptionFr}</p>
                      <div className="project-tech">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">{tech}</span>
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
                        <img
                          src={getUploadUrl(hobby.imageUrl)}
                          alt={`${language === 'en' ? hobby.nameEn : hobby.nameFr} ${t('image', 'image')}`}
                          loading="lazy"
                        />
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
                        {formatDateRange(hobby.startDate, hobby.endDate)}
                      </p>
                      <p className="project-description">
                        {language === 'en' ? hobby.descriptionEn : hobby.descriptionFr}
                      </p>
                      {hobby.technologies && hobby.technologies.length > 0 && (
                        <div className="project-tech">
                          {hobby.technologies.map((tech) => (
                            <span key={tech} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      )}
                      {hobby.links && hobby.links.length > 0 && (
                        <div className="project-links">
                          {hobby.links.map((link, idx) => (
                            <a 
                              key={link.url || idx} 
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
          <div className="testimonials-header">
            <h2 className="section-title">{t('Testimonials', 'Témoignages')}</h2>
            <button 
              className="btn-leave-testimonial"
              type="button"
              onClick={() => { setShowTestimonialModal(true); setFormLoadedAt(Date.now()); }}
            >
              💬 {t('Leave a Testimonial', 'Laisser un Témoignage')}
            </button>
          </div>
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
          {data.testimonials.length === 0 && (
            <p className="empty-state">
              {t('No testimonials yet. Be the first to share your experience!', 
                 'Aucun témoignage pour le moment. Soyez le premier à partager votre expérience !')}
            </p>
          )}
        </div>
      </section>

      {/* Testimonial success toast */}
      {testimonialToast && (
        <div className="toast-popup success" role="status" aria-live="polite" style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 10000, maxWidth: '400px', animation: 'slideIn 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="#10b981">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ color: '#065f46', fontWeight: '600', flex: 1 }}>{testimonialToast}</span>
            <button type="button" aria-label={t('Close notification', 'Fermer la notification')} onClick={() => setTestimonialToast('')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#065f46' }}>&times;</button>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {showTestimonialModal && (
        <div className="modal-overlay">
          <button className="modal-overlay-close" aria-label="Close modal" onClick={() => setShowTestimonialModal(false)} onKeyDown={(e) => { if (e.key === 'Escape') setShowTestimonialModal(false); }} />
          <dialog className="modal-content" open>
            <button 
              className="modal-close"
              type="button"
              aria-label={t('Close modal', 'Fermer la fenêtre')}
              onClick={() => setShowTestimonialModal(false)}
            >
              ×
            </button>
            <h2 className="modal-title">
              {t('Share Your Experience', 'Partagez Votre Expérience')}
            </h2>
            <p className="modal-subtitle">
              {t(
                'Your testimonial will be reviewed before being published.',
                'Votre témoignage sera examiné avant d\'être publié.'
              )}
            </p>

            {testimonialMessage && (
              <div className={`modal-message ${testimonialMessage.includes('Error') || testimonialMessage.includes('Erreur') ? 'error' : 'success'}`}>
                {testimonialMessage}
              </div>
            )}

            <form onSubmit={handleTestimonialSubmit} className="modal-form">
              {/* Honeypot - hidden from real users */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" tabIndex={-1}>
                <label htmlFor="website-hp-testimonial">Website</label>
                <input
                  id="website-hp-testimonial"
                  type="text"
                  name="website"
                  value={testimonialForm.website}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, website: e.target.value })}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              <div className="form-group">
                <label htmlFor="testimonial-name">{t('Name', 'Nom')}</label>
                <input
                  id="testimonial-name"
                  type="text"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  placeholder={t('Your name (or leave blank for anonymous)', 'Votre nom (ou laissez vide pour anonyme)')}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="testimonial-company">{t('Company/Role', 'Entreprise/Rôle')}</label>
                  <input
                    id="testimonial-company"
                    type="text"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    placeholder={t('Company or your role', 'Entreprise ou votre rôle')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="testimonial-project">{t('Project', 'Projet')}</label>
                  <input
                    id="testimonial-project"
                    type="text"
                    value={testimonialForm.projectName}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, projectName: e.target.value })}
                    placeholder={t('Project name', 'Nom du projet')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="testimonial-content">{t('Your Experience', 'Votre Expérience')} *</label>
                <textarea
                  id="testimonial-content"
                  rows="5"
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  placeholder={t('Share your experience working together...', 'Partagez votre expérience de collaboration...')}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowTestimonialModal(false)}>
                  {t('Cancel', 'Annuler')}
                </button>
                <button type="submit" className="btn-submit">
                  {t('Submit', 'Soumettre')}
                </button>
              </div>
            </form>
          </dialog>
        </div>
      )}

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
            {/* Honeypot - hidden from real users */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" tabIndex={-1}>
              <label htmlFor="website-hp-contact">Website</label>
              <input
                id="website-hp-contact"
                type="text"
                name="website"
                value={contactForm.website}
                onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-name">{t('Name', 'Nom')} *</label>
              <input
                id="contact-name"
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                placeholder={t('Your name', 'Votre nom')}
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
                placeholder={t('your.email@example.com', 'votre.email@exemple.com')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">{t('Subject', 'Sujet')}</label>
              <input
                id="contact-subject"
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder={t('Message subject', 'Sujet du message')}
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
                  {contactHref(info) ? (
                    <a href={contactHref(info)} target={info.type === 'email' ? '_self' : '_blank'} rel="noopener noreferrer" className="contact-link">
                      {contactDisplayValue(info)}
                    </a>
                  ) : (
                    <span className="contact-link">{contactDisplayValue(info)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {tf(profile, 'nameEn', 'nameFr')}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <Link to="/privacy-policy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
              {t('Privacy Policy', 'Politique de Confidentialité')}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
