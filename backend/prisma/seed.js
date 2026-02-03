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
    
    // Check if data already exists
    const existingData = await prisma.hobby.count();
    if (existingData > 0) {
      console.log('Database already contains data. Skipping seed to preserve your changes.');
      console.log('To force reseed, run: npm run prisma:reset');
      return;
    }
    
    console.log('Database is empty, seeding initial data...');

    // Skills
    const skillsData = [
      { nameEn: 'Java', nameFr: 'Java', level: 85, category: 'Languages', order: 1 },
      { nameEn: 'Kotlin', nameFr: 'Kotlin', level: 82, category: 'Languages', order: 2 },
      { nameEn: 'JavaScript', nameFr: 'JavaScript', level: 87, category: 'Languages', order: 3 },
      { nameEn: 'TypeScript', nameFr: 'TypeScript', level: 82, category: 'Languages', order: 4 },
      { nameEn: 'C#', nameFr: 'C#', level: 75, category: 'Languages', order: 5 },
      { nameEn: 'Python', nameFr: 'Python', level: 70, category: 'Languages', order: 6 },
      { nameEn: 'PHP', nameFr: 'PHP', level: 68, category: 'Languages', order: 7 },
      { nameEn: 'SQL', nameFr: 'SQL', level: 80, category: 'Languages', order: 8 },
      { nameEn: 'HTML/CSS', nameFr: 'HTML/CSS', level: 88, category: 'Frontend', order: 9 },
      { nameEn: 'Spring Boot', nameFr: 'Spring Boot', level: 80, category: 'Frameworks', order: 10 },
      { nameEn: 'Node.js', nameFr: 'Node.js', level: 82, category: 'Frameworks', order: 11 },
      { nameEn: 'React', nameFr: 'React', level: 85, category: 'Frameworks', order: 12 },
      { nameEn: 'Angular', nameFr: 'Angular', level: 72, category: 'Frameworks', order: 13 },
      { nameEn: 'PostgreSQL', nameFr: 'PostgreSQL', level: 80, category: 'Databases', order: 14 },
      { nameEn: 'MySQL', nameFr: 'MySQL', level: 78, category: 'Databases', order: 15 },
      { nameEn: 'MongoDB', nameFr: 'MongoDB', level: 70, category: 'Databases', order: 16 },
      { nameEn: 'Docker', nameFr: 'Docker', level: 78, category: 'Tools', order: 17 },
      { nameEn: 'Git & GitHub', nameFr: 'Git & GitHub', level: 85, category: 'Tools', order: 18 },
      { nameEn: 'Postman', nameFr: 'Postman', level: 78, category: 'Tools', order: 19 },
      { nameEn: 'JUnit', nameFr: 'JUnit', level: 80, category: 'Testing', order: 20 },
      { nameEn: 'MockWebServer', nameFr: 'MockWebServer', level: 72, category: 'Testing', order: 21 },
      { nameEn: 'Azure', nameFr: 'Azure', level: 65, category: 'Cloud', order: 22 },
      { nameEn: 'Linux', nameFr: 'Linux', level: 70, category: 'Tools', order: 23 },
      { nameEn: 'Android Studio', nameFr: 'Android Studio', level: 68, category: 'Tools', order: 24 },
      { nameEn: 'Swagger', nameFr: 'Swagger', level: 70, category: 'Tools', order: 25 },
    ];

    await prisma.skill.createMany({ data: skillsData, skipDuplicates: true });
    console.log('Skills seeded');

    // Projects
    const projectsData = [
      {
        titleEn: 'Les Constructions Dominic Cyr Web App',
        titleFr: 'Les Constructions Dominic Cyr - Application web',
        descriptionEn:
          'Bilingual client portal centralizing inquiries, document sharing, and communication with end-to-end flow (DTO validation to persistence) and UX polish.',
        descriptionFr:
          'Portail client bilingue pour centraliser inquiries, partage de documents et communication, avec flux complet (validation DTO à la persistance) et UX soignée.',
        imageUrl: '/uploads/projects/dominic-cyr.png',
        projectUrl: null, // Add deployed URL if available
        githubUrl: 'https://github.com/LCDCI/Les-Constructions-Dominic-Cyr',
        technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker', 'Playwright', 'JUnit'],
        featured: true,
        order: 1,
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-12-15'),
      },
      {
        titleEn: 'Champlain Pet Clinic - Contributions',
        titleFr: 'Champlain Pet Clinic - Contributions',
        descriptionEn:
          'Contributed to a microservices-based veterinary clinic management system with Spring Boot, Angular, and MySQL. Implemented features for appointments, customer management, and API integrations.',
        descriptionFr:
          'Contributions à un système de gestion de clinique vétérinaire basé sur microservices avec Spring Boot, Angular et MySQL. Implémentation de fonctionnalités pour rendez-vous, gestion clients et intégrations API.',
        imageUrl: null, // Add your image URL here
        projectUrl: null, // Add deployed URL if available
        githubUrl: 'https://github.com/cgerard321/champlain_petclinic',
        technologies: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'Docker', 'Microservices'],
        featured: true,
        order: 2,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-05-31'),
      },
      {
        titleEn: 'Great Music LLM - Showcase',
        titleFr: 'Great Music LLM - Site vitrine',
        descriptionEn:
          'Mobile-first bilingual landing site with structured navigation, accessibility hardening, and language toggle for music LLM experiments.',
        descriptionFr:
          'Site vitrine bilingue mobile-first avec navigation structurée, accessibilité renforcée et bascule de langue pour les expérimentations LLM musique.',
        imageUrl: '/uploads/projects/great-music-llm.png',
        projectUrl: null, // Add deployed URL if available
        githubUrl: 'https://github.com/josevmorilla/Great-Music-LLM',
        technologies: ['React', 'CSS', 'HTML'],
        featured: true,
        order: 3,
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-11-30'),
      },
      {
        titleEn: 'LikeAHolicApp - Front End',
        titleFr: 'LikeAHolicApp - Front end',
        descriptionEn:
          'Habit-tracking web UI with reusable components, form flows, and UX-oriented layout/styling improvements.',
        descriptionFr:
          "Interface web de suivi d'habitudes avec composants réutilisables, flux de formulaires et améliorations UX de la mise en page.",
        projectUrl: '',
        githubUrl: 'https://github.com/josevmorilla/LikeAHolicApp-FE',
        technologies: ['JavaScript', 'CSS', 'HTML'],
        featured: false,
        order: 4,
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-10-31'),
      },
      {
        titleEn: 'Smart Parking System - Android',
        titleFr: 'Système de stationnement intelligent - Android',
        descriptionEn:
          'Android app to search, reserve, and pay for parking spots with booking flow and payment logic.',
        descriptionFr:
          'Application Android pour rechercher, réserver et payer des places de stationnement avec flux de réservation et logique de paiement.',
        projectUrl: '',
        githubUrl: 'https://github.com/josevmorilla/smart-parking-system',
        technologies: ['Kotlin', 'Android'],
        featured: false,
        order: 5,
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-09-30'),
      },
      {
        titleEn: 'Enrollment System',
        titleFr: "Système d'inscription",
        descriptionEn:
          'Web enrollment system with server-side validation, relational data model, and CRUD for students/courses.',
        descriptionFr:
          "Système d'inscription web avec validation côté serveur, modèle de données relationnel et CRUD pour étudiants/cours.",
        projectUrl: '',
        githubUrl: 'https://github.com/josevmorilla/enrollment-system',
        technologies: ['PHP', 'Laravel', 'MySQL', 'Blade'],
        featured: false,
        order: 5,
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-09-01'),
      },
      {
        titleEn: 'ChampExamenApp',
        titleFr: 'ChampExamenApp',
        descriptionEn:
          'Android/mobile app for exam prep tracking with simple CRUD, state handling, and local persistence.',
        descriptionFr:
          'Application mobile de préparation aux examens avec CRUD simple, gestion d’état et persistance locale.',
        projectUrl: '',
        githubUrl: 'https://github.com/josevmorilla/ChampExamenApp',
        technologies: ['Kotlin', 'Android'],
        featured: false,
        order: 6,
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-31'),
      },
      {
        titleEn: 'Quake Fortress HUD (personal)',
        titleFr: 'HUD Quake Fortress (perso)',
        descriptionEn:
          'Personal HUD redesign for Quake Fortress focused on visibility and theming; not a school/CS project.',
        descriptionFr:
          'Refonte HUD personnelle pour Quake Fortress axée sur la visibilité et le thème; projet non académique.',
        imageUrl: '/uploads/projects/quake-fortress.jpg',
        projectUrl: '',
        githubUrl: 'https://github.com/josevmorilla/qf-hud',
        technologies: ['Lua', 'HUD scripting'],
        featured: false,
        order: 7,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-07-01'),
      },
    ];

    await prisma.project.createMany({ data: projectsData, skipDuplicates: true });
    console.log('Projects seeded');

    // Work experience
    const workExperienceData = [
      {
        companyEn: 'Produits Des Champs',
        companyFr: 'Produits Des Champs',
        positionEn: 'Order Picker',
        positionFr: 'Préparateur de commandes',
        descriptionEn:
          'Picked and palletized 10-15 deliveries/day (50-200+ products) with stable loads and no incidents; coordinated staging per route to cut truck loading time ~15%.',
        descriptionFr:
          'Préparation et palettisation de 10-15 livraisons/jour (50-200+ produits) avec charges stables et zéro incident; coordination du staging par route réduisant ~15% le temps de chargement.',
        location: 'Saint-Hubert, QC',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-31'),
        current: false,
        order: 1,
      },
      {
        companyEn: 'Renouveau La Fontaine',
        companyFr: 'Renouveau La Fontaine',
        positionEn: 'HR Assistant',
        positionFr: 'Adjoint RH',
        descriptionEn:
          'Standardized and organized 100+ HR files in SharePoint with versioning conventions, eliminating duplicates and stale documents.',
        descriptionFr:
          'Standardisation et organisation de 100+ dossiers RH dans SharePoint avec conventions de versionnage, éliminant doublons et fichiers obsolètes.',
        location: 'Longueuil, QC',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-08-31'),
        current: false,
        order: 2,
      },
    ];

    await prisma.workExperience.createMany({ data: workExperienceData, skipDuplicates: true });
    console.log('Work experience seeded');

    // Education
    const educationData = [
      {
        institutionEn: 'Champlain College Saint-Lambert',
        institutionFr: 'Champlain College Saint-Lambert',
        degreeEn: 'DEC',
        degreeFr: 'DEC',
        fieldEn: 'Computer Science Technology',
        fieldFr: "Technique de l'informatique",
        descriptionEn: 'Honour roll (Fall 2024, Winter 2025).',
        descriptionFr: "Liste d'honneur (Automne 2024, Hiver 2025).",
        location: 'Saint-Lambert, QC',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2026-05-31'),
        current: true,
        order: 1,
      },
      {
        institutionEn: 'Collège Charles-Lemoyne',
        institutionFr: 'Collège Charles-Lemoyne',
        degreeEn: 'DES',
        degreeFr: 'DES',
        fieldEn: 'High School Diploma',
        fieldFr: "Diplôme d'études secondaires",
        descriptionEn: null,
        descriptionFr: null,
        location: 'Longueuil, QC',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2023-06-30'),
        current: false,
        order: 2,
      },
    ];

    await prisma.education.createMany({ data: educationData, skipDuplicates: true });
    console.log('Education seeded');

    // Contact info
    const contactInfoData = [
      { type: 'email', label: 'Email', value: 'josevillegasmori@gmail.com', visible: true, order: 1 },
      { type: 'location', label: 'Location', value: 'Montreal, QC, Canada', visible: true, order: 2 },
      { type: 'linkedin', label: 'LinkedIn', value: 'https://www.linkedin.com/in/jose-villegas-morilla/', visible: true, order: 3 },
      { type: 'github', label: 'GitHub', value: 'https://github.com/josevmorilla', visible: true, order: 4 },
    ];

    await prisma.contactInfo.createMany({ data: contactInfoData, skipDuplicates: true });
    console.log('Contact info seeded');

    // Hobbies
    const hobbiesData = [
      {
        nameEn: 'Open Fortress HUD',
        nameFr: 'HUD pour Open Fortress',
        descriptionEn: 'A custom heads-up display (HUD) designed for Open Fortress, a fast-paced Source Engine mod. Inspired by the minimalist and efficient design of Quake, this HUD provides clear visibility of health, ammo, and game information while maintaining the aesthetic of classic arena shooters. Built using VGUI scripting, VTFEdit for texture creation, and GIMP for graphic design, the HUD emphasizes readability and performance in competitive gameplay.',
        descriptionFr: 'Une interface utilisateur (HUD) personnalisée conçue pour Open Fortress, un mod rapide du moteur Source. Inspiré par le design minimaliste et efficace de Quake, ce HUD offre une visibilité claire de la santé, des munitions et des informations de jeu tout en maintenant l\'esthétique des shooters d\'arène classiques. Construit avec le scripting VGUI, VTFEdit pour la création de textures et GIMP pour la conception graphique, le HUD met l\'accent sur la lisibilité et la performance en jeu compétitif.',
        technologies: ['VGUI', 'VTFEdit', 'GIMP', 'Source Engine'],
        imageUrl: '/uploads/projects/open-fortress-hud.jpg',
        links: [
          { label: 'GameBanana', url: 'https://gamebanana.com/mods/616975' }
        ],
        featured: true,
        order: 0,
      },
      {
        nameEn: 'Video games',
        nameFr: 'Jeux vidéo',
        descriptionEn: 'Team Fortress 2, Open Fortress, Deadlock.',
        descriptionFr: 'Team Fortress 2, Open Fortress, Deadlock.',
        order: 1,
      },
      {
        nameEn: 'Music',
        nameFr: 'Musique',
        descriptionEn: 'Listening and discovery across genres.',
        descriptionFr: 'Écoute et découverte de divers genres.',
        order: 2,
      },
      {
        nameEn: 'Swimming',
        nameFr: 'Natation',
        descriptionEn: 'Staying active through swimming.',
        descriptionFr: 'Rester actif grâce à la natation.',
        order: 3,
      },
    ];

    await prisma.hobby.createMany({ data: hobbiesData, skipDuplicates: true });
    console.log('Hobbies seeded');

    // Resumes
    const resumesData = [
      {
        filename: 'cv-english.pdf',
        fileUrl: '/uploads/resumes/cv-english.pdf',
        language: 'en',
        titleEn: 'Resume',
        titleFr: 'CV',
        current: true,
      },
      {
        filename: 'cv-french.pdf',
        fileUrl: '/uploads/resumes/cv-french.pdf',
        language: 'fr',
        titleEn: 'Resume',
        titleFr: 'CV',
        current: true,
      },
    ];

    await prisma.resume.createMany({ data: resumesData, skipDuplicates: true });
    console.log('Resumes seeded');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
