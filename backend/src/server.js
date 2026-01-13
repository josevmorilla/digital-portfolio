require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const projectRoutes = require('./routes/projects');
const workExperienceRoutes = require('./routes/workExperience');
const educationRoutes = require('./routes/education');
const contactInfoRoutes = require('./routes/contactInfo');
const hobbyRoutes = require('./routes/hobbies');
const testimonialRoutes = require('./routes/testimonials');
const contactMessageRoutes = require('./routes/contactMessages');
const resumeRoutes = require('./routes/resumes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/work-experience', workExperienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/hobbies', hobbyRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact-messages', contactMessageRoutes);
app.use('/api/resumes', resumeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
