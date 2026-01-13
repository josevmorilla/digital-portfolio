const prisma = require('../config/database');
const path = require('path');
const fs = require('fs');

// Get all resumes (admin sees all, public sees only current ones)
exports.getAll = async (req, res) => {
  try {
    const isAdmin = req.user !== undefined;
    const where = isAdmin ? {} : { current: true };
    
    const resumes = await prisma.resume.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
      where: {
        language,
        current: true,
      },
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

    const filePath = path.join(__dirname, '../../..', resume.fileUrl);

    if (!fs.existsSync(filePath)) {
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

    const { language, setCurrent } = req.body;

    // If setting as current, unset other current resumes for this language
    if (setCurrent === 'true' || setCurrent === true) {
      await prisma.resume.updateMany({
        where: { language, current: true },
        data: { current: false },
      });
    }

    const resume = await prisma.resume.create({
      data: {
        filename: req.file.originalname,
        fileUrl: `uploads/${req.file.filename}`,
        language: language || 'en',
        current: setCurrent === 'true' || setCurrent === true,
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
    const { language, current } = req.body;

    // If setting as current, unset other current resumes for this language
    if (current === 'true' || current === true) {
      const resume = await prisma.resume.findUnique({
        where: { id: req.params.id },
      });
      
      if (resume) {
        await prisma.resume.updateMany({
          where: {
            language: resume.language,
            current: true,
            id: { not: req.params.id },
          },
          data: { current: false },
        });
      }
    }

    const updatedResume = await prisma.resume.update({
      where: { id: req.params.id },
      data: {
        language,
        current: current !== undefined ? current === 'true' || current === true : undefined,
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

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../..', resume.fileUrl);
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
