const prisma = require('../config/database');

// Get all hobbies
exports.getAll = async (req, res) => {
  try {
    const hobbies = await prisma.hobby.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(hobbies);
  } catch (error) {
    console.error('Get hobbies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get hobby by ID
exports.getById = async (req, res) => {
  try {
    const hobby = await prisma.hobby.findUnique({
      where: { id: req.params.id },
    });

    if (!hobby) {
      return res.status(404).json({ error: 'Hobby not found' });
    }

    res.json(hobby);
  } catch (error) {
    console.error('Get hobby error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create hobby
exports.create = async (req, res) => {
  try {
    const { nameEn, nameFr, descriptionEn, descriptionFr, icon, imageUrl, links, technologies, startDate, endDate, featured, order } = req.body;

    const hobby = await prisma.hobby.create({
      data: {
        nameEn,
        nameFr,
        descriptionEn,
        descriptionFr,
        icon,
        imageUrl,
        links: links || undefined,
        technologies: technologies || [],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        featured: featured === true || featured === 'true',
        order: order ? parseInt(order) : 0,
      },
    });

    res.status(201).json(hobby);
  } catch (error) {
    console.error('Create hobby error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update hobby
exports.update = async (req, res) => {
  try {
    const { nameEn, nameFr, descriptionEn, descriptionFr, icon, imageUrl, links, technologies, startDate, endDate, featured, order } = req.body;

    const hobby = await prisma.hobby.update({
      where: { id: req.params.id },
      data: {
        nameEn,
        nameFr,
        descriptionEn,
        descriptionFr,
        icon,
        imageUrl,
        links: links !== undefined ? links : undefined,
        technologies: technologies !== undefined ? technologies : undefined,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        featured: featured !== undefined ? (featured === true || featured === 'true') : undefined,
        order: order !== undefined ? parseInt(order) : undefined,
      },
    });

    res.json(hobby);
  } catch (error) {
    console.error('Update hobby error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Hobby not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete hobby
exports.delete = async (req, res) => {
  try {
    await prisma.hobby.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Hobby deleted successfully' });
  } catch (error) {
    console.error('Delete hobby error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Hobby not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
