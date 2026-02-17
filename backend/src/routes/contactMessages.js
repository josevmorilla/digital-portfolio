const express = require('express');
const { body } = require('express-validator');
const contactMessageController = require('../controllers/contactMessageController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const { formLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public route – rate limited to prevent spam
router.post(
  '/',
  formLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
    validate,
  ],
  contactMessageController.create
);

// Admin routes
router.get('/', authMiddleware, contactMessageController.getAll);
router.get('/unread-count', authMiddleware, contactMessageController.getUnreadCount);
router.get('/:id', authMiddleware, contactMessageController.getById);
router.post('/:id/read', authMiddleware, contactMessageController.markAsRead);
router.delete('/:id', authMiddleware, contactMessageController.delete);

module.exports = router;
