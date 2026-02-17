const express = require('express');
const { body } = require('express-validator');
const workExperienceController = require('../controllers/workExperienceController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', workExperienceController.getAll);
router.get('/:id', workExperienceController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  [
    body('companyEn').notEmpty().withMessage('English company name is required'),
    body('companyFr').notEmpty().withMessage('French company name is required'),
    body('positionEn').notEmpty().withMessage('English position is required'),
    body('positionFr').notEmpty().withMessage('French position is required'),
    body('descriptionEn').notEmpty().withMessage('English description is required'),
    body('descriptionFr').notEmpty().withMessage('French description is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    validate,
  ],
  workExperienceController.create
);

router.put(
  '/:id',
  authMiddleware,
  [
    body('companyEn').optional().notEmpty().withMessage('English company name cannot be empty'),
    body('companyFr').optional().notEmpty().withMessage('French company name cannot be empty'),
    body('positionEn').optional().notEmpty().withMessage('English position cannot be empty'),
    body('positionFr').optional().notEmpty().withMessage('French position cannot be empty'),
    body('descriptionEn').optional().notEmpty().withMessage('English description cannot be empty'),
    body('descriptionFr').optional().notEmpty().withMessage('French description cannot be empty'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    validate,
  ],
  workExperienceController.update
);
router.delete('/:id', authMiddleware, workExperienceController.delete);

module.exports = router;
