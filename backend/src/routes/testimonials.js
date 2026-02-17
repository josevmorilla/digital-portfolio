const express = require('express');
const { body } = require('express-validator');
const testimonialController = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Optional auth middleware - checks token but doesn't require it
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    return authMiddleware(req, res, next);
  }
  next();
};

// Public routes (with optional auth for admin view)
router.get('/', optionalAuth, testimonialController.getAll);
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
router.put(
  '/:id',
  authMiddleware,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('position').optional().notEmpty().withMessage('Position cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    validate,
  ],
  testimonialController.update
);
router.post('/:id/approve', authMiddleware, testimonialController.approve);
router.post('/:id/reject', authMiddleware, testimonialController.reject);
router.delete('/:id', authMiddleware, testimonialController.delete);

module.exports = router;
