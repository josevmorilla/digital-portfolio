const express = require('express');
const { body } = require('express-validator');
const contactInfoController = require('../controllers/contactInfoController');
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

// Public routes (with optional auth so admin can see hidden items)
router.get('/', optionalAuth, contactInfoController.getAll);

// Admin routes
router.get('/:id', authMiddleware, contactInfoController.getById);
router.post(
  '/',
  authMiddleware,
  [
    body('type').notEmpty().withMessage('Type is required'),
    body('label').notEmpty().withMessage('Label is required'),
    body('value').notEmpty().withMessage('Value is required'),
    validate,
  ],
  contactInfoController.create
);

router.put(
  '/:id',
  authMiddleware,
  [
    body('type').optional().notEmpty().withMessage('Type cannot be empty'),
    body('label').optional().notEmpty().withMessage('Label cannot be empty'),
    body('value').optional().notEmpty().withMessage('Value cannot be empty'),
    validate,
  ],
  contactInfoController.update
);
router.delete('/:id', authMiddleware, contactInfoController.delete);

module.exports = router;
