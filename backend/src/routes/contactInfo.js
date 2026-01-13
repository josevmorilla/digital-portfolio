const express = require('express');
const { body } = require('express-validator');
const contactInfoController = require('../controllers/contactInfoController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Public routes (only visible ones)
router.get('/', contactInfoController.getAll);

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

router.put('/:id', authMiddleware, contactInfoController.update);
router.delete('/:id', authMiddleware, contactInfoController.delete);

module.exports = router;
