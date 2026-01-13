const express = require('express');
const { body } = require('express-validator');
const educationController = require('../controllers/educationController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', educationController.getAll);
router.get('/:id', educationController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  [
    body('institutionEn').notEmpty().withMessage('English institution name is required'),
    body('institutionEs').notEmpty().withMessage('Spanish institution name is required'),
    body('degreeEn').notEmpty().withMessage('English degree is required'),
    body('degreeEs').notEmpty().withMessage('Spanish degree is required'),
    body('fieldEn').notEmpty().withMessage('English field is required'),
    body('fieldEs').notEmpty().withMessage('Spanish field is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    validate,
  ],
  educationController.create
);

router.put('/:id', authMiddleware, educationController.update);
router.delete('/:id', authMiddleware, educationController.delete);

module.exports = router;
