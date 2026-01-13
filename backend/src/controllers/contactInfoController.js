const prisma = require('../config/database');

// Get all contact info (public can see only visible ones)
exports.getAll = async (req, res) => {
  try {
    const isAdmin = req.user !== undefined; // Check if user is authenticated
    const where = isAdmin ? {} : { visible: true };
    
    const contactInfo = await prisma.contactInfo.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    res.json(contactInfo);
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get contact info by ID
exports.getById = async (req, res) => {
  try {
    const contactInfo = await prisma.contactInfo.findUnique({
      where: { id: req.params.id },
    });

    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    res.json(contactInfo);
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create contact info
exports.create = async (req, res) => {
  try {
    const { type, label, value, icon, order, visible } = req.body;

    const contactInfo = await prisma.contactInfo.create({
      data: {
        type,
        label,
        value,
        icon,
        order: order ? parseInt(order) : 0,
        visible: visible !== undefined ? visible === true || visible === 'true' : true,
      },
    });

    res.status(201).json(contactInfo);
  } catch (error) {
    console.error('Create contact info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update contact info
exports.update = async (req, res) => {
  try {
    const { type, label, value, icon, order, visible } = req.body;

    const contactInfo = await prisma.contactInfo.update({
      where: { id: req.params.id },
      data: {
        type,
        label,
        value,
        icon,
        order: order !== undefined ? parseInt(order) : undefined,
        visible: visible !== undefined ? visible === true || visible === 'true' : undefined,
      },
    });

    res.json(contactInfo);
  } catch (error) {
    console.error('Update contact info error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact info not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete contact info
exports.delete = async (req, res) => {
  try {
    await prisma.contactInfo.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Contact info deleted successfully' });
  } catch (error) {
    console.error('Delete contact info error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact info not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
