const express = require('express');
const categorySettingsController = require('../controllers/categorySettingsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public — get all category settings
router.get('/', categorySettingsController.getAll);

// Admin — bulk update
router.put('/', authMiddleware, categorySettingsController.updateAll);

module.exports = router;
