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
  const [skillsCarouselIndex, setSkillsCarouselIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [contactMessage, setContactMessage] = useState('');
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [formLoadedAt, setFormLoadedAt] = useState(Date.now());
  const [testimonialForm, setTestimonialForm] = useState({ 
    name: '', 
    company: '', 
    projectName: '',
    technicalExpertise: 0,
    codeQuality: 0,
    communication: 0,
    deadlines: 0,
    overallSatisfaction: 0,
    problemAndResults: '',
    doubtsOvercome: '',
    bestPart: '',
    wouldRecommend: '',
    permissionGranted: false,
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
      ] = await Promise.all([
        skillsAPI.getAll(),
        projectsAPI.getAll(),
        workExperienceAPI.getAll(),
        educationAPI.getAll(),
        contactInfoAPI.getAll(),
        hobbiesAPI.getAll(),
        testimonialsAPI.getAll(),
        profileAPI.get().catch(() => ({ data: null })),
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
    if (Date.now() - formLoadedAt < 3000) {
      setContactMessage(t('Please wait a moment before submitting.', 'Veuillez patienter un instant avant de soumettre.'));
      return;
    }
    try {
      await contactMessagesAPI.create(contactForm);
      setContactMessage(t('Message sent successfully!', 'Message envoyé avec succès !'));
      setContactForm({ name: '', email: '', subject: '', message: '', website: '' });
      setTimeout(() => setContactMessage(''), 3000);
    } catch (error) {
      setContactMessage(t('Error sending message', 'Erreur lors de l\'envoi du message'));
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    
    if (!testimonialForm.permissionGranted) {
      setTestimonialMessage(t(
        'Please grant permission to use your testimonial.',
        'Veuillez autoriser l\'utilisation de votre témoignage.'
      ));
      return;
    }

    // Validate ratings
    if (
      testimonialForm.technicalExpertise === 0 ||
      testimonialForm.codeQuality === 0 ||
      testimonialForm.communication === 0 ||
      testimonialForm.deadlines === 0 ||
      testimonialForm.overallSatisfaction === 0
    ) {
      setTestimonialMessage(t(
        'Please provide all ratings (1-5 stars).',
        'Veuillez fournir toutes les notes (1-5 étoiles).'
      ));
      return;
    }

    try {
      // Structure the comprehensive feedback
      const content = `
RATINGS (out of 5):
- Technical Expertise: ${testimonialForm.technicalExpertise}/5
- Code Quality: ${testimonialForm.codeQuality}/5
- Communication: ${testimonialForm.communication}/5
- Meeting Deadlines: ${testimonialForm.deadlines}/5
- Overall Satisfaction: ${testimonialForm.overallSatisfaction}/5

DETAILED FEEDBACK:

Problem & Results:
${testimonialForm.problemAndResults}

Doubts Overcome:
${testimonialForm.doubtsOvercome}

Best Part:
${testimonialForm.bestPart}

Would Recommend:
${testimonialForm.wouldRecommend}
      `.trim();

      const submissionData = {
        name: testimonialForm.name || 'Anonymous',
        position: testimonialForm.projectName || 'Client',
        company: testimonialForm.company || null,
        content: content,
        website: testimonialForm.website || ''
      };

      if (Date.now() - formLoadedAt < 3000) {
        setTestimonialMessage(t('Please wait a moment before submitting.', 'Veuillez patienter un instant avant de soumettre.'));
        return;
      }

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
        website: '',
        technicalExpertise: 0,
        codeQuality: 0,
        communication: 0,
        deadlines: 0,
        overallSatisfaction: 0,
        problemAndResults: '',
        doubtsOvercome: '',
        bestPart: '',
        wouldRecommend: '',
        permissionGranted: false
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

  // Parse structured testimonial content
  const parseTestimonialContent = (content) => {
    const ratings = {};
    const feedback = {};
    
    // Extract ratings
    const ratingMatches = content.match(/Technical Expertise: (\d+)\/5/i);
    if (ratingMatches) ratings.technicalExpertise = parseInt(ratingMatches[1]);
    
    const codeQualityMatches = content.match(/Code Quality: (\d+)\/5/i);
    if (codeQualityMatches) ratings.codeQuality = parseInt(codeQualityMatches[1]);
    
    const communicationMatches = content.match(/Communication: (\d+)\/5/i);
    if (communicationMatches) ratings.communication = parseInt(communicationMatches[1]);
    
    const deadlinesMatches = content.match(/Meeting Deadlines: (\d+)\/5/i);
    if (deadlinesMatches) ratings.deadlines = parseInt(deadlinesMatches[1]);
    
    const overallMatches = content.match(/Overall Satisfaction: (\d+)\/5/i);
    if (overallMatches) ratings.overall = parseInt(overallMatches[1]);
    
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
      <span className="testimonial-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>
            ★
          </span>
        ))}
      </span>
    );
  };

  const getAverageRating = (ratings) => {
    if (!ratings || Object.keys(ratings).length === 0) return 0;
    const values = Object.values(ratings);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="home">
      {/* Header */}
      <header className="header" role="banner">
        <div className="container">
          <nav className="nav">
            <span className="logo">{profile ? (language === 'en' ? profile.nameEn : profile.nameFr) : ''}</span>
            <button 
              className={`hamburger ${mobileMenuOpen ? 'open' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              <a href="#skills" onClick={() => setMobileMenuOpen(false)}>{t('Skills', 'Compétences')}</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)}>{t('Projects', 'Projets')}</a>
              <a href="#experience" onClick={() => setMobileMenuOpen(false)}>{t('Experience', 'Expérience')}</a>
              <a href="#education" onClick={() => setMobileMenuOpen(false)}>{t('Education', 'Éducation')}</a>
              <a href="#hobbies" onClick={() => setMobileMenuOpen(false)}>{t('Hobbies', 'Loisirs')}</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>{t('Testimonials', 'Témoignages')}</a>
              <a href="#contact-form" onClick={() => setMobileMenuOpen(false)}>{t('Get in Touch', 'Contactez-moi')}</a>
              <button onClick={toggleLanguage} className="lang-btn">
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
          <h1 className="hero-title">{profile ? (language === 'en' ? profile.nameEn : profile.nameFr) : ''}</h1>
          <p className="hero-subtitle">
            {profile ? (language === 'en' ? profile.titleEn : profile.titleFr) : ''}
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
                    <h3>{skill.displayName}</h3>
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
            <span className="carousel-counter">{currentSlide + 1} / {totalSlides}</span>
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
                      <img src={getUploadUrl(project.imageUrl)} alt="" loading="lazy" />
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
                        <img src={getUploadUrl(hobby.imageUrl)} alt="" loading="lazy" />
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
          <div className="testimonials-header">
            <h2 className="section-title">{t('Testimonials', 'Témoignages')}</h2>
            <button 
              className="btn-leave-testimonial"
              onClick={() => { setShowTestimonialModal(true); setFormLoadedAt(Date.now()); }}
            >
              💬 {t('Leave a Testimonial', 'Laisser un Témoignage')}
            </button>
          </div>
          <div className="testimonials-grid">
            {data.testimonials.map((testimonial) => {
              const parsed = parseTestimonialContent(testimonial.content);
              const avgRating = getAverageRating(parsed.ratings);
              
              return (
                <div key={testimonial.id} className="testimonial-card">
                  {parsed.isStructured ? (
                    <>
                      {/* Average Rating Display */}
                      {avgRating > 0 && (
                        <div className="testimonial-rating-header">
                          {renderStars(Math.round(avgRating))}
                          <span className="rating-number">{avgRating}/5</span>
                        </div>
                      )}
                      
                      {/* Best Part (Main Quote) */}
                      {parsed.feedback.bestPart && (
                        <p className="testimonial-content">
                          "{parsed.feedback.bestPart}"
                        </p>
                      )}
                      
                      {/* Problem & Results */}
                      {parsed.feedback.problemResults && (
                        <div className="testimonial-detail">
                          <strong>{t('Results:', 'Résultats :')}</strong>
                          <p>{parsed.feedback.problemResults}</p>
                        </div>
                      )}
                      
                      {/* Would Recommend */}
                      {parsed.feedback.wouldRecommend && (
                        <div className="testimonial-recommend">
                          <p><em>{parsed.feedback.wouldRecommend}</em></p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="testimonial-content">"{testimonial.content}"</p>
                  )}
                  
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.position}</span>
                    {testimonial.company && <span>{testimonial.company}</span>}
                  </div>
                </div>
              );
            })}
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
        <div className="toast-popup success" style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 10000, maxWidth: '400px', animation: 'slideIn 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="#10b981">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ color: '#065f46', fontWeight: '600', flex: 1 }}>{testimonialToast}</span>
            <button onClick={() => setTestimonialToast('')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#065f46' }}>&times;</button>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {showTestimonialModal && (
        <div className="modal-overlay" onClick={() => setShowTestimonialModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
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
              {/* Section 1: General Information */}
              <div className="form-section">
                <h3 className="form-section-title">
                  {t('1. General Information (Optional)', '1. Informations Générales (Optionnel)')}
                </h3>
                
                <div className="form-group">
                  <label>{t('Name', 'Nom')}</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    placeholder={t('Your name or stay anonymous', 'Votre nom ou restez anonyme')}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('Company/Role', 'Entreprise/Rôle')}</label>
                    <input
                      type="text"
                      value={testimonialForm.company}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                      placeholder={t('Company or your role', 'Entreprise ou votre rôle')}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('Project Name', 'Nom du Projet')}</label>
                    <input
                      type="text"
                      value={testimonialForm.projectName}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, projectName: e.target.value })}
                      placeholder={t('Project name', 'Nom du projet')}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Core Evaluation */}
              <div className="form-section">
                <h3 className="form-section-title">
                  {t('2. Core Evaluation (Rate 1-5)', '2. Évaluation de Base (Note 1-5)')}
                </h3>
                
                <div className="rating-group">
                  <label>{t('Technical expertise?', 'Expertise technique ?')} *</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${star <= testimonialForm.technicalExpertise ? 'active' : ''}`}
                        onClick={() => setTestimonialForm({ ...testimonialForm, technicalExpertise: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rating-group">
                  <label>{t('Quality of code/deliverables?', 'Qualité du code/livrables ?')} *</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${star <= testimonialForm.codeQuality ? 'active' : ''}`}
                        onClick={() => setTestimonialForm({ ...testimonialForm, codeQuality: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rating-group">
                  <label>{t('Communication effectiveness?', 'Efficacité de la communication ?')} *</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${star <= testimonialForm.communication ? 'active' : ''}`}
                        onClick={() => setTestimonialForm({ ...testimonialForm, communication: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rating-group">
                  <label>{t('Meeting deadlines/milestones?', 'Respect des délais ?')} *</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${star <= testimonialForm.deadlines ? 'active' : ''}`}
                        onClick={() => setTestimonialForm({ ...testimonialForm, deadlines: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rating-group">
                  <label>{t('Overall satisfaction?', 'Satisfaction globale ?')} *</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${star <= testimonialForm.overallSatisfaction ? 'active' : ''}`}
                        onClick={() => setTestimonialForm({ ...testimonialForm, overallSatisfaction: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Qualitative Feedback */}
              <div className="form-section">
                <h3 className="form-section-title">
                  {t('3. Qualitative Feedback', '3. Commentaires Qualitatifs')}
                </h3>

                <div className="form-group">
                  <label>{t('What problem were you facing, and what specific results did the developer deliver?', 'Quel problème aviez-vous et quels résultats spécifiques le développeur a-t-il livrés ?')} *</label>
                  <textarea
                    rows="3"
                    value={testimonialForm.problemAndResults}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, problemAndResults: e.target.value })}
                    placeholder={t('Describe the problem and results...', 'Décrivez le problème et les résultats...')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('What was your biggest doubt when hiring, and how did they overcome it?', 'Quel était votre plus grand doute lors de l\'embauche et comment l\'ont-ils surmonté ?')} *</label>
                  <textarea
                    rows="3"
                    value={testimonialForm.doubtsOvercome}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, doubtsOvercome: e.target.value })}
                    placeholder={t('Your doubts and how they were addressed...', 'Vos doutes et comment ils ont été résolus...')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('What is the best part about working with this developer?', 'Quel est le meilleur aspect du travail avec ce développeur ?')} *</label>
                  <textarea
                    rows="3"
                    value={testimonialForm.bestPart}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, bestPart: e.target.value })}
                    placeholder={t('What stood out the most...', 'Ce qui vous a le plus marqué...')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('Would you recommend this developer to a colleague?', 'Recommanderiez-vous ce développeur à un collègue ?')} *</label>
                  <textarea
                    rows="2"
                    value={testimonialForm.wouldRecommend}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, wouldRecommend: e.target.value })}
                    placeholder={t('Yes/No and why...', 'Oui/Non et pourquoi...')}
                    required
                  />
                </div>
              </div>

              {/* Section 4: Authorization */}
              <div className="form-section">
                <h3 className="form-section-title">
                  {t('4. Authorization', '4. Autorisation')}
                </h3>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={testimonialForm.permissionGranted}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, permissionGranted: e.target.checked })}
                      required
                    />
                    <span>
                      {t(
                        'I give permission to use this testimonial on the developer\'s portfolio/website *',
                        'J\'autorise l\'utilisation de ce témoignage sur le portfolio/site web du développeur *'
                      )}
                    </span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowTestimonialModal(false)}>
                  {t('Cancel', 'Annuler')}
                </button>
                <button type="submit" className="btn-submit">
                  {t('Submit Testimonial', 'Soumettre')}
                </button>
              </div>
            </form>
          </div>
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
          <p>&copy; {new Date().getFullYear()} {profile ? (language === 'en' ? profile.nameEn : profile.nameFr) : ''}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
