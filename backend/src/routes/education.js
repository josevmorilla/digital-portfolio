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
    body('institutionFr').notEmpty().withMessage('French institution name is required'),
    body('degreeEn').notEmpty().withMessage('English degree is required'),
    body('degreeFr').notEmpty().withMessage('French degree is required'),
    body('fieldEn').notEmpty().withMessage('English field is required'),
    body('fieldFr').notEmpty().withMessage('French field is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    validate,
  ],
  educationController.create
);

router.put(
  '/:id',
  authMiddleware,
  [
    body('institutionEn').optional().notEmpty().withMessage('English institution name cannot be empty'),
    body('institutionFr').optional().notEmpty().withMessage('French institution name cannot be empty'),
    body('degreeEn').optional().notEmpty().withMessage('English degree cannot be empty'),
    body('degreeFr').optional().notEmpty().withMessage('French degree cannot be empty'),
    body('fieldEn').optional().notEmpty().withMessage('English field cannot be empty'),
    body('fieldFr').optional().notEmpty().withMessage('French field cannot be empty'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    validate,
  ],
  educationController.update
);
router.delete('/:id', authMiddleware, educationController.delete);

module.exports = router;
