const prisma = require('../config/database');

// Get all education records
exports.getAll = async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { startDate: 'desc' },
    });
    res.json(education);
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get education by ID
exports.getById = async (req, res) => {
  try {
    const education = await prisma.education.findUnique({
      where: { id: req.params.id },
    });

    if (!education) {
      return res.status(404).json({ error: 'Education record not found' });
    }

    res.json(education);
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create education
exports.create = async (req, res) => {
  try {
    const {
      institutionEn,
      institutionEs,
      degreeEn,
      degreeEs,
      fieldEn,
      fieldEs,
      descriptionEn,
      descriptionEs,
      location,
      startDate,
      endDate,
      current,
      gpa,
      order,
    } = req.body;

    const education = await prisma.education.create({
      data: {
        institutionEn,
        institutionEs,
        degreeEn,
        degreeEs,
        fieldEn,
        fieldEs,
        descriptionEn,
        descriptionEs,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current === true || current === 'true',
        gpa,
        order: order ? parseInt(order) : 0,
      },
    });

    res.status(201).json(education);
  } catch (error) {
    console.error('Create education error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update education
exports.update = async (req, res) => {
  try {
    const {
      institutionEn,
      institutionEs,
      degreeEn,
      degreeEs,
      fieldEn,
      fieldEs,
      descriptionEn,
      descriptionEs,
      location,
      startDate,
      endDate,
      current,
      gpa,
      order,
    } = req.body;

    const education = await prisma.education.update({
      where: { id: req.params.id },
      data: {
        institutionEn,
        institutionEs,
        degreeEn,
        degreeEs,
        fieldEn,
        fieldEs,
        descriptionEn,
        descriptionEs,
        location,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        current: current !== undefined ? current === true || current === 'true' : undefined,
        gpa,
        order: order !== undefined ? parseInt(order) : undefined,
      },
    });

    res.json(education);
  } catch (error) {
    console.error('Update education error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Education record not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete education
exports.delete = async (req, res) => {
  try {
    await prisma.education.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Education record deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Education record not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
