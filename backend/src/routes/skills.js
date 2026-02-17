const express = require('express');
const { body } = require('express-validator');
const skillController = require('../controllers/skillController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', skillController.getAll);
router.get('/:id', skillController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  [
    body('nameEn').notEmpty().withMessage('English name is required'),
    body('nameFr').notEmpty().withMessage('French name is required'),
    body('level').isInt({ min: 1, max: 100 }).withMessage('Level must be between 1 and 100'),
    body('category').notEmpty().withMessage('Category is required'),
    validate,
  ],
  skillController.create
);

router.put(
  '/:id',
  authMiddleware,
  [
    body('nameEn').optional().notEmpty().withMessage('English name cannot be empty'),
    body('nameFr').optional().notEmpty().withMessage('French name cannot be empty'),
    body('level').optional().isInt({ min: 1, max: 100 }).withMessage('Level must be between 1 and 100'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    validate,
  ],
  skillController.update
);
router.delete('/:id', authMiddleware, skillController.delete);

module.exports = router;
