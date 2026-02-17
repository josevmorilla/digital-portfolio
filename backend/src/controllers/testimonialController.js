const prisma = require('../config/database');

// Get all testimonials (public only sees approved ones)
exports.getAll = async (req, res) => {
  try {
    const isAdmin = req.user !== undefined; // Check if user is authenticated
    const where = isAdmin ? {} : { approved: true };
    
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get testimonial by ID
exports.getById = async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: req.params.id },
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create testimonial (public endpoint - no auth required)
exports.create = async (req, res) => {
  try {
    const { name, position, company, content, imageUrl } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        position,
        company,
        content,
        imageUrl,
        approved: false, // Needs admin approval
        order: 0,
      },
    });

    res.status(201).json({
      message: 'Testimonial submitted successfully. It will be visible after admin approval.',
      testimonial,
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update testimonial (admin only)
exports.update = async (req, res) => {
  try {
    const { name, position, company, content, imageUrl, approved, order } = req.body;

    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: {
        name,
        position,
        company,
        content,
        imageUrl,
        approved: approved !== undefined ? approved === true || approved === 'true' : undefined,
        order: order !== undefined ? parseInt(order) : undefined,
      },
    });

    res.json(testimonial);
  } catch (error) {
    console.error('Update testimonial error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Approve testimonial (admin only)
exports.approve = async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: { approved: true },
    });

    res.json({ message: 'Testimonial approved successfully', testimonial });
  } catch (error) {
    console.error('Approve testimonial error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reject testimonial (admin only) - deletes it
exports.reject = async (req, res) => {
  try {
    await prisma.testimonial.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Testimonial rejected and removed successfully' });
  } catch (error) {
    console.error('Reject testimonial error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete testimonial
exports.delete = async (req, res) => {
  try {
    await prisma.testimonial.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
