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
    body('companyEs').notEmpty().withMessage('Spanish company name is required'),
    body('positionEn').notEmpty().withMessage('English position is required'),
    body('positionEs').notEmpty().withMessage('Spanish position is required'),
    body('descriptionEn').notEmpty().withMessage('English description is required'),
    body('descriptionEs').notEmpty().withMessage('Spanish description is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    validate,
  ],
  workExperienceController.create
);

router.put('/:id', authMiddleware, workExperienceController.update);
router.delete('/:id', authMiddleware, workExperienceController.delete);

module.exports = router;
