const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
// Always resolve relative to the project root (__dirname = backend/src/utils)
// so that CWD changes (e.g. "cd backend && node src/server.js") don't matter.
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const uploadDir = process.env.UPLOAD_DIR
  ? (path.isAbsolute(process.env.UPLOAD_DIR)
      ? process.env.UPLOAD_DIR
      : path.resolve(PROJECT_ROOT, process.env.UPLOAD_DIR))
  : path.join(PROJECT_ROOT, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories for different file types
const resumesDir = path.join(uploadDir, 'resumes');
const projectsDir = path.join(uploadDir, 'projects');

[resumesDir, projectsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure storage for project images
const projectImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for resumes
const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
  }
};

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP images are allowed.'));
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
});

const uploadProjectImage = multer({
  storage: projectImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

module.exports = {
  uploadResume,
  uploadProjectImage,
  // For backward compatibility
  upload: uploadResume,
  // Expose the resolved upload directory so server.js can serve from the same path
  uploadDir,
};
