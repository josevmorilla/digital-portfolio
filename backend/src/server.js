const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');

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

// CORS: support comma-separated origins in FRONTEND_URL
// Automatically handles www / non-www variants so you don't have to list both
const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, '')); // strip trailing slashes

// Build full set: for every origin, add its www/non-www counterpart
const allowedOrigins = new Set();
configuredOrigins.forEach(origin => {
  allowedOrigins.add(origin);
  try {
    const u = new URL(origin);
    if (u.hostname.startsWith('www.')) {
      u.hostname = u.hostname.slice(4);
    } else {
      u.hostname = 'www.' + u.hostname;
    }
    allowedOrigins.add(u.origin);
  } catch (_) { /* ignore malformed URLs */ }
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
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
