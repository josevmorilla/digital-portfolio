const express = require('express');
const { body } = require('express-validator');
const hobbyController = require('../controllers/hobbyController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', hobbyController.getAll);
router.get('/:id', hobbyController.getById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  [
    body('nameEn').notEmpty().withMessage('English name is required'),
    body('nameFr').notEmpty().withMessage('French name is required'),
    validate,
  ],
  hobbyController.create
);

router.put('/:id', authMiddleware, hobbyController.update);
router.delete('/:id', authMiddleware, hobbyController.delete);

module.exports = router;
