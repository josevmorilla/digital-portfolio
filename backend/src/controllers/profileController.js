const prisma = require('../config/database');

// Get profile (returns a single profile or null)
exports.get = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create or update profile (upsert - only one profile exists)
exports.upsert = async (req, res) => {
  try {
    const { nameEn, nameFr, titleEn, titleFr, bioEn, bioFr } = req.body;

    // Check if a profile already exists
    const existing = await prisma.profile.findFirst();

    let profile;
    if (existing) {
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data: { nameEn, nameFr, titleEn, titleFr, bioEn, bioFr },
      });
    } else {
      profile = await prisma.profile.create({
        data: { nameEn, nameFr, titleEn, titleFr, bioEn, bioFr },
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Upsert profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
