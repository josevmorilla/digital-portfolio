const prisma = require('../config/database');

// Get all skills
exports.getAll = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get skill by ID
exports.getById = async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id },
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create skill
exports.create = async (req, res) => {
  try {
    const { nameEn, nameEs, level, category, icon, order } = req.body;

    const skill = await prisma.skill.create({
      data: {
        nameEn,
        nameEs,
        level: parseInt(level),
        category,
        icon,
        order: order ? parseInt(order) : 0,
      },
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update skill
exports.update = async (req, res) => {
  try {
    const { nameEn, nameEs, level, category, icon, order } = req.body;

    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: {
        nameEn,
        nameEs,
        level: level ? parseInt(level) : undefined,
        category,
        icon,
        order: order !== undefined ? parseInt(order) : undefined,
      },
    });

    res.json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete skill
exports.delete = async (req, res) => {
  try {
    await prisma.skill.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
