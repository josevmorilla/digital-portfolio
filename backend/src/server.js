const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const { uploadDir } = require('./utils/upload');

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
const profileRoutes = require('./routes/profile');

const { globalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Hide Express fingerprint
app.disable('x-powered-by');

// Trust proxy (Railway runs behind a reverse proxy that sets X-Forwarded-For)
app.set('trust proxy', 1);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

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
    // Allow Vercel preview deployments (random subdomain pattern)
    try {
      const u = new URL(origin);
      if (u.hostname.endsWith('.vercel.app')) return callback(null, true);
    } catch (_) { /* ignore */ }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting – defend against spam / brute-force
app.use('/api', globalLimiter);

// Serve uploaded files – use the same resolved uploadDir that multer writes to
console.log('Serving uploads from:', uploadDir);
app.use('/uploads', express.static(uploadDir));

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
app.use('/api/profile', profileRoutes);

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

// Fallback handler for /uploads – diagnose missing files
app.use('/uploads', (req, res) => {
  const requestedFile = path.join(uploadDir, req.path);
  const dirPath = path.dirname(requestedFile);
  const dirExists = fs.existsSync(dirPath);
  const files = dirExists ? fs.readdirSync(dirPath) : [];
  console.error(`Upload 404: ${requestedFile} | dir exists: ${dirExists} | files in dir: [${files.join(', ')}]`);
  res.status(404).json({ error: 'File not found', path: requestedFile, dirExists, filesInDir: files });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
