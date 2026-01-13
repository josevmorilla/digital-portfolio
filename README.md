# Digital Portfolio

A fully dynamic, responsive, bilingual portfolio website with a secure admin dashboard. Built with Express.js, PostgreSQL, Prisma ORM, React, and Vite.

## Features

### Public Portfolio

- ✅ **Bilingual Support** - Switch between English and Spanish
- ✅ **Responsive Design** - Works on all devices
- ✅ **Dynamic Content** - All content loaded from database
- ✅ **Skills Showcase** - Display skills with proficiency levels
- ✅ **Projects Portfolio** - Showcase projects with images, descriptions, and links
- ✅ **Work Experience** - Timeline of professional experience
- ✅ **Education** - Academic background
- ✅ **Hobbies & Interests** - Personal interests section
- ✅ **Testimonials** - Client/colleague testimonials (approval required)
- ✅ **Contact Form** - Visitors can send messages
- ✅ **CV Download** - Download resume in multiple languages

### Admin Dashboard

- ✅ **Secure Authentication** - JWT-based login system
- ✅ **Full CRUD Operations** for:
  - Skills
  - Projects
  - Work Experience
  - Education
  - Contact Information
  - Hobbies
  - Testimonials (with approval system)
- ✅ **Message Inbox** - View contact form submissions
- ✅ **Resume Management** - Upload and manage CV files
- ✅ **Input Validation** - Server-side validation on all endpoints
- ✅ **Clean Separation** - Admin and public routes separated

## Technology Stack

### Backend

- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Prisma** - Modern ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **express-validator** - Input validation

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/josevmorilla/digital-portfolio.git
   cd digital-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"
   PORT=5000
   JWT_SECRET=your-secret-key-change-this
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed initial data (creates admin user)
   npm run prisma:seed
   ```

5. **Start the development servers**

   Terminal 1 - Backend:

   ```bash
   npm run dev
   ```

   Terminal 2 - Frontend:

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Public Portfolio: <http://localhost:5173>
   - Admin Dashboard: <http://localhost:5173/admin/login>
   - Default Admin Credentials:
     - Email: `admin@portfolio.com`
     - Password: `admin123`
     - **⚠️ Change these immediately after first login!**

## Project Structure

```
digital-portfolio/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Database seeding
│   └── src/
│       ├── config/
│       │   └── database.js    # Prisma client
│       ├── controllers/       # Route handlers
│       ├── middleware/        # Auth & validation
│       ├── routes/            # API routes
│       ├── utils/             # Utilities (JWT, upload)
│       └── server.js          # Express server
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (Auth, Language)
│   │   ├── pages/
│   │   │   ├── public/        # Public portfolio pages
│   │   │   └── admin/         # Admin dashboard pages
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   └── vite.config.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Public Endpoints

- `GET /api/skills` - Get all skills
- `GET /api/projects` - Get all projects
- `GET /api/work-experience` - Get work experience
- `GET /api/education` - Get education
- `GET /api/contact-info` - Get contact information
- `GET /api/hobbies` - Get hobbies
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/contact-messages` - Submit contact form
- `POST /api/testimonials` - Submit testimonial
- `GET /api/resumes/current/:language` - Get current resume
- `GET /api/resumes/:id/download` - Download resume

### Admin Endpoints (Require Authentication)

All CRUD operations for:

- `/api/skills` - Skills management
- `/api/projects` - Projects management
- `/api/work-experience` - Work experience management
- `/api/education` - Education management
- `/api/contact-info` - Contact info management
- `/api/hobbies` - Hobbies management
- `/api/testimonials` - Testimonials management + approval
- `/api/contact-messages` - View messages
- `/api/resumes` - Resume management

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

## Database Schema

The application uses the following models:

- **User** - Admin users
- **Skill** - Technical and soft skills
- **Project** - Portfolio projects
- **WorkExperience** - Professional experience
- **Education** - Academic background
- **ContactInfo** - Contact information
- **Hobby** - Hobbies and interests
- **Testimonial** - Client testimonials (with approval)
- **ContactMessage** - Contact form submissions
- **Resume** - CV/Resume files

All content models include bilingual fields (`nameEn`/`nameEs`, etc.) for English and Spanish support.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation on all endpoints
- Protected admin routes
- CORS configuration
- Testimonial moderation (admin approval required)
- Secure file upload handling

## Development Scripts

```bash
# Backend
npm run dev              # Start backend with nodemon
npm run start            # Start backend (production)
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
npm run setup            # Full setup (generate + migrate + seed)

# Frontend
cd frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

## Deployment

### Option 1: Railway (Recommended)

1. Create a Railway account at <https://railway.app>
2. Create a new PostgreSQL database
3. Create a new project from GitHub
4. Set environment variables in Railway dashboard
5. Deploy!

### Option 2: Vercel + Render/Heroku

- Frontend: Deploy to Vercel
- Backend: Deploy to Render or Heroku
- Database: Use Railway or Heroku PostgreSQL

### Option 3: Docker

```bash
# Coming soon - Docker configuration
```

## Contributing

This is a personal portfolio project. Feel free to fork and adapt for your own use!

## License

ISC

## Support

For issues or questions, please create an issue in the GitHub repository.
