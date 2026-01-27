const prisma = require('../config/database');

// Get all projects
exports.getAll = async (req, res) => {
  try {
    const { featured } = req.query;
    const where = featured === 'true' ? { featured: true } : {};
    
    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get project by ID
exports.getById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create project
exports.create = async (req, res) => {
  try {
    const {
      titleEn,
      titleFr,
      descriptionEn,
      descriptionFr,
      imageUrl,
      projectUrl,
      githubUrl,
      technologies,
      featured,
      order,
      startDate,
      endDate,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        titleEn,
        titleFr,
        descriptionEn,
        descriptionFr,
        imageUrl,
        projectUrl,
        githubUrl,
        technologies: technologies || [],
        featured: featured === true || featured === 'true',
        order: order ? parseInt(order) : 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update project
exports.update = async (req, res) => {
  try {
    const {
      titleEn,
      titleFr,
      descriptionEn,
      descriptionFr,
      imageUrl,
      projectUrl,
      githubUrl,
      technologies,
      featured,
      order,
      startDate,
      endDate,
    } = req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        titleEn,
        titleFr,
        descriptionEn,
        descriptionFr,
        imageUrl,
        projectUrl,
        githubUrl,
        technologies: technologies || undefined,
        featured: featured !== undefined ? featured === true || featured === 'true' : undefined,
        order: order !== undefined ? parseInt(order) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete project
exports.delete = async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
