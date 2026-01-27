const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

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

router.put('/:id', authMiddleware, projectController.update);
router.delete('/:id', authMiddleware, projectController.delete);

module.exports = router;
