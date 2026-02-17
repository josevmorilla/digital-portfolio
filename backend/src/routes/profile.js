const express = require('express');
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Public route
router.get('/', profileController.get);

// Admin route
router.put(
  '/',
  authMiddleware,
  [
    body('nameEn').notEmpty().withMessage('English name is required'),
    body('nameFr').notEmpty().withMessage('French name is required'),
    body('titleEn').notEmpty().withMessage('English title is required'),
    body('titleFr').notEmpty().withMessage('French title is required'),
    validate,
  ],
  profileController.upsert
);

module.exports = router;
