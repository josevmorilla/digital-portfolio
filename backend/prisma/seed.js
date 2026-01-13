require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'admin123',
      10
    );

    const admin = await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL || 'admin@portfolio.com' },
      update: {},
      create: {
        email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
        password: hashedPassword,
        name: 'Admin User',
      },
    });

    console.log('Admin user created:', admin.email);

    // Sample skills
    await prisma.skill.createMany({
      data: [
        {
          nameEn: 'JavaScript',
          nameFr: 'JavaScript',
          level: 90,
          category: 'Programming',
          order: 1,
        },
        {
          nameEn: 'React',
          nameFr: 'React',
          level: 85,
          category: 'Framework',
          order: 2,
        },
        {
          nameEn: 'Node.js',
          nameFr: 'Node.js',
          level: 80,
          category: 'Backend',
          order: 3,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Sample skills created');

    // Sample contact info
    await prisma.contactInfo.createMany({
      data: [
        {
          type: 'email',
          label: 'Email',
          value: 'contact@portfolio.com',
          visible: true,
          order: 1,
        },
        {
          type: 'github',
          label: 'GitHub',
          value: 'https://github.com/username',
          visible: true,
          order: 2,
        },
        {
          type: 'linkedin',
          label: 'LinkedIn',
          value: 'https://linkedin.com/in/username',
          visible: true,
          order: 3,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Sample contact info created');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
