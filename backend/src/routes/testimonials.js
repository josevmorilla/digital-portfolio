const express = require('express');
const { body } = require('express-validator');
const testimonialController = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', testimonialController.getAll);
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('content').notEmpty().withMessage('Content is required'),
    validate,
  ],
  testimonialController.create
);

// Admin routes
router.get('/:id', authMiddleware, testimonialController.getById);
router.put('/:id', authMiddleware, testimonialController.update);
router.post('/:id/approve', authMiddleware, testimonialController.approve);
router.delete('/:id', authMiddleware, testimonialController.delete);

module.exports = router;
