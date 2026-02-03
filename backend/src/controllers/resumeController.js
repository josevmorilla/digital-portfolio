const prisma = require('../config/database');
const path = require('path');
const fs = require('fs');

// Get all resumes (admin sees all, public sees only current ones)
exports.getAll = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current resume by language
exports.getCurrentByLanguage = async (req, res) => {
  try {
    const { language } = req.params;

    const resume = await prisma.resume.findFirst({
      where: { language },
      orderBy: { order: 'asc' },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get current resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Download resume
exports.download = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Handle both old paths (/uploads/file.pdf) and new paths (/uploads/resumes/file.pdf)
    let filePath;
    if (resume.fileUrl.startsWith('/uploads/resumes/')) {
      filePath = path.join(__dirname, '../../..', resume.fileUrl);
    } else if (resume.fileUrl.startsWith('/uploads/')) {
      // Check if file exists in old location
      const oldPath = path.join(__dirname, '../../..', resume.fileUrl);
      if (fs.existsSync(oldPath)) {
        filePath = oldPath;
      } else {
        // Try new resumes subdirectory
        const filename = path.basename(resume.fileUrl);
        filePath = path.join(__dirname, '../../../uploads/resumes', filename);
      }
    } else {
      filePath = path.join(__dirname, '../../..', resume.fileUrl);
    }

    if (!fs.existsSync(filePath)) {
      console.error('Resume file not found at:', filePath);
      console.error('Looking for fileUrl:', resume.fileUrl);
      return res.status(404).json({ error: 'Resume file not found' });
    }

    res.download(filePath, resume.filename);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upload resume (admin only)
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { titleEn, titleFr, descriptionEn, descriptionFr, language, order } = req.body;

    if (!titleEn || !titleFr) {
      return res.status(400).json({ error: 'Title in both languages is required' });
    }

    const resume = await prisma.resume.create({
      data: {
        titleEn,
        titleFr,
        descriptionEn: descriptionEn || null,
        descriptionFr: descriptionFr || null,
        filename: req.file.originalname,
        fileUrl: `/uploads/resumes/${req.file.filename}`,
        language: language || 'en',
        order: parseInt(order) || 0,
      },
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update resume (admin only)
exports.update = async (req, res) => {
  try {
    const { titleEn, titleFr, descriptionEn, descriptionFr, language, order } = req.body;

    const updatedResume = await prisma.resume.update({
      where: { id: req.params.id },
      data: {
        titleEn: titleEn || undefined,
        titleFr: titleFr || undefined,
        descriptionEn: descriptionEn !== undefined ? descriptionEn || null : undefined,
        descriptionFr: descriptionFr !== undefined ? descriptionFr || null : undefined,
        language: language || undefined,
        order: order !== undefined ? parseInt(order) : undefined,
      },
    });

    res.json(updatedResume);
  } catch (error) {
    console.error('Update resume error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete resume (admin only)
exports.delete = async (req, res) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: req.params.id },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete file from filesystem - handle both old and new paths
    let filePath;
    if (resume.fileUrl.startsWith('/uploads/resumes/')) {
      filePath = path.join(__dirname, '../../..', resume.fileUrl);
    } else if (resume.fileUrl.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '../../..', resume.fileUrl);
      if (fs.existsSync(oldPath)) {
        filePath = oldPath;
      } else {
        const filename = path.basename(resume.fileUrl);
        filePath = path.join(__dirname, '../../../uploads/resumes', filename);
      }
    } else {
      filePath = path.join(__dirname, '../../..', resume.fileUrl);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.resume.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
