const express = require('express');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

// Public routes
router.get('/', resumeController.getAll);
router.get('/current/:language', resumeController.getCurrentByLanguage);
router.get('/:id/download', resumeController.download);

// Admin routes
router.post('/', authMiddleware, upload.single('resume'), resumeController.upload);
router.put('/:id', authMiddleware, resumeController.update);
router.delete('/:id', authMiddleware, resumeController.delete);

module.exports = router;
