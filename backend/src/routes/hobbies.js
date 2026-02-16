const express = require('express');
const fs = require('fs');
const { body } = require('express-validator');
const hobbyController = require('../controllers/hobbyController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');
const { uploadHobbyImage } = require('../utils/upload');

const router = express.Router();

// Public routes
router.get('/', hobbyController.getAll);
router.get('/:id', hobbyController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  [
    body('nameEn').notEmpty().withMessage('English name is required'),
    body('nameFr').notEmpty().withMessage('French name is required'),
    validate,
  ],
  hobbyController.create
);

// Image upload route
router.post(
  '/upload-image',
  authMiddleware,
  uploadHobbyImage.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }
      const imageUrl = `/uploads/hobbies/${req.file.filename}`;

      // Verify the file was actually written to disk
      const savedPath = req.file.path;
      if (!fs.existsSync(savedPath)) {
        console.error('Upload verification failed! File not found at:', savedPath);
        return res.status(500).json({ error: 'File was not saved correctly', savedPath });
      }
      console.log('Hobby upload OK:', savedPath, '| size:', req.file.size);
      res.json({ imageUrl });
    } catch (error) {
      console.error('Hobby image upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }
);

router.put('/:id', authMiddleware, hobbyController.update);
router.delete('/:id', authMiddleware, hobbyController.delete);

module.exports = router;
