const prisma = require('../config/database');

// Get all category settings (auto-creates missing ones from existing skills)
exports.getAll = async (req, res) => {
  try {
    // Discover categories from skills
    const skills = await prisma.skill.findMany({ select: { category: true } });
    const uniqueCategories = [...new Set(skills.map((s) => s.category))];

    // Get existing settings
    const existing = await prisma.categorySettings.findMany();
    const existingSet = new Set(existing.map((s) => s.category));

    // Auto-create defaults for any new categories
    const newCats = uniqueCategories.filter((c) => !existingSet.has(c));
    if (newCats.length > 0) {
      await prisma.categorySettings.createMany({
        data: newCats.map((category, i) => ({
          category,
          displayOrder: existing.length + i,
          speed: 4000,
        })),
        skipDuplicates: true,
      });
    }

    const all = await prisma.categorySettings.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(all);
  } catch (error) {
    console.error('Get category settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Bulk update category settings
exports.updateAll = async (req, res) => {
  try {
    const { settings } = req.body; // [{category, displayOrder, speed}]

    if (!Array.isArray(settings)) {
      return res.status(400).json({ error: 'settings must be an array' });
    }

    for (const s of settings) {
      await prisma.categorySettings.upsert({
        where: { category: s.category },
        update: {
          displayOrder: parseInt(s.displayOrder),
          speed: parseInt(s.speed),
        },
        create: {
          category: s.category,
          displayOrder: parseInt(s.displayOrder),
          speed: parseInt(s.speed),
        },
      });
    }

    const all = await prisma.categorySettings.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(all);
  } catch (error) {
    console.error('Update category settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
