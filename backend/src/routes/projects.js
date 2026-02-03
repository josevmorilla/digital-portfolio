const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');
const { uploadProjectImage } = require('../utils/upload');

const router = express.Router();

// Public routes
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  [
    body('titleEn').notEmpty().withMessage('English title is required'),
    body('titleFr').notEmpty().withMessage('French title is required'),
    body('descriptionEn').notEmpty().withMessage('English description is required'),
    body('descriptionFr').notEmpty().withMessage('French description is required'),
    validate,
  ],
  projectController.create
);

// Image upload route
router.post(
  '/upload-image',
  authMiddleware,
  uploadProjectImage.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }
      // Return the path relative to uploads directory
      const imageUrl = `/uploads/projects/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }
);

router.put('/:id', authMiddleware, projectController.update);
router.delete('/:id', authMiddleware, projectController.delete);

module.exports = router;
