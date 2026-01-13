import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  skillsAPI,
  projectsAPI,
  workExperienceAPI,
  educationAPI,
  contactInfoAPI,
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
  const [currentResume, setCurrentResume] = useState(null);

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

      // Fetch current resume
      try {
        const resumeRes = await resumesAPI.getCurrentByLanguage(language);
        setCurrentResume(resumeRes.data);
      } catch (error) {
        console.log('No resume available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const t = (en, fr) => (language === 'en' ? en : fr);

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <h1 className="logo">{t('Portfolio', 'Portfolio')}</h1>
            <div className="nav-links">
              <a href="#skills">{t('Skills', 'Compétences')}</a>
              <a href="#projects">{t('Projects', 'Projets')}</a>
              <a href="#experience">{t('Experience', 'Expérience')}</a>
              <a href="#education">{t('Education', 'Éducation')}</a>
              <a href="#hobbies">{t('Hobbies', 'Loisirs')}</a>
              <a href="#testimonials">{t('Testimonials', 'Témoignages')}</a>
              <Link to="/contact">{t('Contact', 'Contact')}</Link>
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
          <h1 className="hero-title">{t('Welcome to My Portfolio', 'Bienvenue sur Mon Portfolio')}</h1>
          <p className="hero-subtitle">
            {t(
              'Full Stack Developer & Digital Creator',
              'Desarrollador Full Stack y Creador Digital'
            )}
          </p>
          {currentResume && (
            <a
              href={resumesAPI.download(currentResume.id)}
              download
              className="btn-download"
            >
              {t('Download CV', 'Télécharger CV')}
            </a>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <div className="container">
          <h2 className="section-title">{t('Skills', 'Compétences')}</h2>
          <div className="skills-grid">
            {data.skills.map((skill) => (
              <div key={skill.id} className="skill-card">
                <h3>{language === 'en' ? skill.nameEn : skill.nameFr}</h3>
                <div className="skill-bar">
                  <div
                    className="skill-progress"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <span className="skill-level">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section bg-light">
        <div className="container">
          <h2 className="section-title">{t('Projects', 'Projets')}</h2>
          <div className="projects-grid">
            {data.projects.map((project) => (
              <div key={project.id} className="project-card">
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={language === 'en' ? project.titleEn : project.titleEs} />
                )}
                <h3>{language === 'en' ? project.titleEn : project.titleEs}</h3>
                <p>{language === 'en' ? project.descriptionEn : project.descriptionEs}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      {t('View Project', 'Voir le Projet')}
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
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
          <div className="hobbies-grid">
            {data.hobbies.map((hobby) => (
              <div key={hobby.id} className="hobby-card">
                <h3>{language === 'en' ? hobby.nameEn : hobby.nameFr}</h3>
                {hobby.descriptionEn && (
                  <p>{language === 'en' ? hobby.descriptionEn : hobby.descriptionFr}</p>
                )}
              </div>
            ))}
          </div>
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

      {/* Contact Info Section */}
      <section id="contact-section" className="section">
        <div className="container">
          <h2 className="section-title">{t('Contact Information', 'Informations de Contact')}</h2>
          <div className="contact-info-grid">
            {data.contactInfo.map((info) => (
              <div key={info.id} className="contact-info-item">
                <strong>{info.label}:</strong> <span>{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {t('All rights reserved', 'Tous droits réservés')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
