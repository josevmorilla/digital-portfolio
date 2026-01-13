const prisma = require('../config/database');

// Get all work experiences
exports.getAll = async (req, res) => {
  try {
    const experiences = await prisma.workExperience.findMany({
      orderBy: { startDate: 'desc' },
    });
    res.json(experiences);
  } catch (error) {
    console.error('Get work experiences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get work experience by ID
exports.getById = async (req, res) => {
  try {
    const experience = await prisma.workExperience.findUnique({
      where: { id: req.params.id },
    });

    if (!experience) {
      return res.status(404).json({ error: 'Work experience not found' });
    }

    res.json(experience);
  } catch (error) {
    console.error('Get work experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create work experience
exports.create = async (req, res) => {
  try {
    const {
      companyEn,
      companyEs,
      positionEn,
      positionEs,
      descriptionEn,
      descriptionEs,
      location,
      startDate,
      endDate,
      current,
      order,
    } = req.body;

    const experience = await prisma.workExperience.create({
      data: {
        companyEn,
        companyEs,
        positionEn,
        positionEs,
        descriptionEn,
        descriptionEs,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current === true || current === 'true',
        order: order ? parseInt(order) : 0,
      },
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error('Create work experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update work experience
exports.update = async (req, res) => {
  try {
    const {
      companyEn,
      companyEs,
      positionEn,
      positionEs,
      descriptionEn,
      descriptionEs,
      location,
      startDate,
      endDate,
      current,
      order,
    } = req.body;

    const experience = await prisma.workExperience.update({
      where: { id: req.params.id },
      data: {
        companyEn,
        companyEs,
        positionEn,
        positionEs,
        descriptionEn,
        descriptionEs,
        location,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        current: current !== undefined ? current === true || current === 'true' : undefined,
        order: order !== undefined ? parseInt(order) : undefined,
      },
    });

    res.json(experience);
  } catch (error) {
    console.error('Update work experience error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Work experience not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete work experience
exports.delete = async (req, res) => {
  try {
    await prisma.workExperience.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Work experience deleted successfully' });
  } catch (error) {
    console.error('Delete work experience error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Work experience not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
