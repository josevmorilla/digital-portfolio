# Digital Portfolio

A full-stack, bilingual portfolio website with a secure admin dashboard. This project demonstrates modern web development practices using React, Express.js, PostgreSQL, and Prisma ORM.

**Live Demo:** [Coming Soon]

## About This Project

This is a complete portfolio management system that I built to showcase my full-stack development skills. All content is managed through an authenticated admin panel without needing to touch code. The application supports bilingual content (English/French) and includes a REST API backend with a responsive React frontend.

## Key Features

**Content Management**
- Full CRUD admin dashboard for managing portfolio content
- Bilingual support (English/French) with database-backed translations
- Dynamic content updates without code changes
- File upload system for resumes and project images

**Public Portfolio**
- Responsive design that works on all devices
- Skills showcase with proficiency levels and categories
- Project gallery with images, descriptions, and live links
- Work experience timeline
- Education history
- Hobbies and interests section
- Client testimonials with admin approval system
- Contact form with message storage

**Technical Implementation**
- RESTful API with Express.js
- JWT-based authentication for admin access
- PostgreSQL database with Prisma ORM
- Input validation and error handling
- CORS configuration
- Secure password hashing
- Protected routes and middleware

## Tech Stack

**Backend**
- Express.js - Web framework
- PostgreSQL - Database
- Prisma - ORM and migrations
- JWT - Authentication
- bcryptjs - Password security
- Multer - File uploads
- express-validator - Input validation

**Frontend**
- React 18 - UI framework
- Vite - Build tool and dev server
- React Router - Client-side routing
- Context API - State management
- Axios - HTTP client

## Getting Started

This project can be forked and used as a template for your own portfolio. Here's how to run it locally:

### Prerequisites

- Node.js 16 or higher
- PostgreSQL 12 or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/josevmorilla/digital-portfolio.git
cd digital-portfolio

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Initialize database
npm run setup

# Start development servers (use 2 terminals)
npm run dev              # Terminal 1: Backend (port 5000)
cd frontend && npm run dev   # Terminal 2: Frontend (port 5173)
```

Visit http://localhost:5173 to see the portfolio

Admin login: http://localhost:5173/admin/login (default: admin@portfolio.com / admin123)

### Environment Variables

Required variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
PORT=5000
JWT_SECRET=your-random-secret-key
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
backend/
  prisma/
    schema.prisma    # Database schema
    seed.js          # Initial data seeding
  src/
    controllers/     # Business logic
    middleware/      # Auth & validation
    routes/          # API endpoints
    server.js        # Express app

frontend/
  src/
    components/      # Reusable components
    context/         # Auth & language state
    pages/
      public/        # Portfolio pages
      admin/         # Dashboard pages
    services/        # API integration
```

## API Documentation

**Public Endpoints**
- `GET /api/skills` - List all skills
- `GET /api/projects` - List all projects
- `GET /api/work-experience` - List work history
- `GET /api/education` - List education
- `GET /api/hobbies` - List hobbies
- `GET /api/testimonials` - List approved testimonials
- `GET /api/contact-info` - Get contact information
- `POST /api/contact-messages` - Submit contact form
- `GET /api/resumes/current/:language` - Get current resume

**Admin Endpoints** (Require JWT token)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- Full CRUD operations on all content types
- Testimonial approval
- Resume management

## Available Scripts

```bash
# Backend
npm run dev              # Start with nodemon
npm run setup            # Generate + migrate + seed database
npm run prisma:studio    # Open database GUI

# Frontend
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
```

## What I Learned

Building this project helped me practice:
- Full-stack application architecture
- RESTful API design and implementation
- Database modeling with Prisma ORM
- JWT authentication and authorization
- File upload handling
- Form validation on client and server
- React Context API for state management
- Bilingual content management
- Responsive CSS design

## Contributing

This is a personal portfolio project, but feel free to fork it and adapt it for your own use. If you find bugs or have suggestions, please open an issue.

## License

ISC
