# System Architecture

This document provides a visual overview of the Digital Portfolio system architecture.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENT BROWSER                            │
│                                                                      │
│  ┌──────────────────────┐         ┌───────────────────────┐        │
│  │   Public Portfolio   │         │   Admin Dashboard     │        │
│  │   (React SPA)        │         │   (React SPA)         │        │
│  │                      │         │                       │        │
│  │  - Homepage          │         │  - Login              │        │
│  │  - Contact Page      │         │  - Dashboard          │        │
│  │  - Language Toggle   │         │  - CRUD Pages         │        │
│  └──────────┬───────────┘         └───────────┬───────────┘        │
│             │                                  │                    │
│             └──────────────┬───────────────────┘                    │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │ HTTPS/JSON
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                            │                                        │
│                     ┌──────▼──────┐                                │
│                     │   Express   │                                │
│                     │   Server    │                                │
│                     │  (Node.js)  │                                │
│                     └──────┬──────┘                                │
│                            │                                        │
│  ┌─────────────────────────┼─────────────────────────┐             │
│  │                         │                         │             │
│  │  ┌──────────────────┐   │   ┌──────────────────┐ │             │
│  │  │   Middleware     │   │   │   Middleware     │ │             │
│  │  │                  │   │   │                  │ │             │
│  │  │  - CORS          │◄──┼───┤  - Auth (JWT)    │ │             │
│  │  │  - Body Parser   │   │   │  - Validation    │ │             │
│  │  │  - Static Files  │   │   └──────────────────┘ │             │
│  │  └──────────────────┘   │                         │             │
│  │                         │                         │             │
│  │  ┌──────────────────────▼──────────────────────┐ │             │
│  │  │            API Routes                       │ │             │
│  │  │                                             │ │             │
│  │  │  /api/auth          /api/skills            │ │             │
│  │  │  /api/projects      /api/work-experience   │ │             │
│  │  │  /api/education     /api/contact-info      │ │             │
│  │  │  /api/hobbies       /api/testimonials      │ │             │
│  │  │  /api/contact-messages  /api/resumes       │ │             │
│  │  └──────────────────────┬──────────────────────┘ │             │
│  │                         │                         │             │
│  │  ┌──────────────────────▼──────────────────────┐ │             │
│  │  │            Controllers                      │ │             │
│  │  │                                             │ │             │
│  │  │  - authController                           │ │             │
│  │  │  - skillController                          │ │             │
│  │  │  - projectController                        │ │             │
│  │  │  - workExperienceController                 │ │             │
│  │  │  - educationController                      │ │             │
│  │  │  - contactInfoController                    │ │             │
│  │  │  - hobbyController                          │ │             │
│  │  │  - testimonialController                    │ │             │
│  │  │  - contactMessageController                 │ │             │
│  │  │  - resumeController                         │ │             │
│  │  └──────────────────────┬──────────────────────┘ │             │
│  │                         │                         │             │
│  └─────────────────────────┼─────────────────────────┘             │
│                            │                                        │
│                     ┌──────▼──────┐                                │
│                     │   Prisma    │                                │
│                     │     ORM     │                                │
│                     └──────┬──────┘                                │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │ SQL
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                      PostgreSQL Database                            │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │   User   │  │  Skill   │  │ Project  │  │   Work   │           │
│  │          │  │          │  │          │  │Experience│           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │Education │  │ Contact  │  │  Hobby   │  │Testimon- │           │
│  │          │  │   Info   │  │          │  │   ial    │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                      │
│  ┌──────────┐  ┌──────────┐                                        │
│  │ Contact  │  │  Resume  │                                        │
│  │ Message  │  │          │                                        │
│  └──────────┘  └──────────┘                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### Public Page Request Flow

```
User Browser
    │
    │ 1. Visit http://localhost:5173
    ▼
Vite Dev Server (Frontend)
    │
    │ 2. Load React App
    ▼
Home Component
    │
    │ 3. useEffect - Fetch data
    ▼
API Service (axios)
    │
    │ 4. GET /api/skills, /api/projects, etc.
    ▼
Express Server (Backend)
    │
    │ 5. Route to controller
    ▼
Controller
    │
    │ 6. Prisma query
    ▼
PostgreSQL Database
    │
    │ 7. Return data
    ▼
Controller
    │
    │ 8. JSON response
    ▼
Frontend
    │
    │ 9. Update state & render
    ▼
User sees content
```

### Admin CRUD Request Flow

```
Admin Browser
    │
    │ 1. Visit /admin/login
    ▼
AdminLogin Component
    │
    │ 2. Submit credentials
    ▼
API: POST /api/auth/login
    │
    │ 3. authController.login
    ▼
Database: Check credentials
    │
    │ 4. Return JWT token
    ▼
Frontend: Save token
    │
    │ 5. Navigate to /admin/skills
    ▼
AdminSkills Component
    │
    │ 6. GET /api/skills
    │    Header: Authorization: Bearer <token>
    ▼
Middleware: authMiddleware
    │
    │ 7. Verify JWT
    ▼
Controller: skillController.getAll
    │
    │ 8. Prisma query
    ▼
Database: Return skills
    │
    │ 9. JSON response
    ▼
Frontend: Render skills list
    │
    │ 10. Admin creates new skill
    ▼
API: POST /api/skills
    │   Header: Authorization: Bearer <token>
    │   Body: { nameEn, nameEs, level, ... }
    ▼
Middleware: Validate input
    │
    │ 11. Validation passed
    ▼
Controller: skillController.create
    │
    │ 12. Prisma.create()
    ▼
Database: Insert skill
    │
    │ 13. Return new skill
    ▼
Frontend: Update list & show success
```

---

## Authentication Flow

```
┌──────────────┐
│    Admin     │
│   Browser    │
└──────┬───────┘
       │ 1. POST /api/auth/login
       │    { email, password }
       ▼
┌──────────────────────┐
│  authController      │
│     .login()         │
└──────┬───────────────┘
       │ 2. Find user by email
       ▼
┌──────────────────────┐
│    Database          │
│   User table         │
└──────┬───────────────┘
       │ 3. User found
       ▼
┌──────────────────────┐
│   bcrypt.compare()   │
│  (password hash)     │
└──────┬───────────────┘
       │ 4. Password valid
       ▼
┌──────────────────────┐
│ jwt.sign()           │
│ Generate token       │
└──────┬───────────────┘
       │ 5. Return token + user
       ▼
┌──────────────────────┐
│   Frontend           │
│ - Save to localStorage│
│ - Set Authorization  │
│   header for future  │
│   requests           │
└──────┬───────────────┘
       │ 6. Future requests
       │    Authorization: Bearer <token>
       ▼
┌──────────────────────┐
│  authMiddleware      │
│  - Verify token      │
│  - Attach user to req│
└──────┬───────────────┘
       │ 7. req.user available
       ▼
┌──────────────────────┐
│   Controller         │
│   (Protected route)  │
└──────────────────────┘
```

---

## Data Model Relationships

```
┌─────────────┐
│    User     │
│             │
│ id          │
│ email       │◄─────────────┐
│ password    │              │ Admin manages all content
│ name        │              │
└─────────────┘              │
                             │
        ┌────────────────────┴─────────────────────┬──────────────┬───────────────┐
        │                    │                     │              │               │
        ▼                    ▼                     ▼              ▼               ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Skill     │      │  Project    │      │    Work     │  │  Education  │  │   Hobby     │
│             │      │             │      │ Experience  │  │             │  │             │
│ nameEn      │      │ titleEn     │      │ companyEn   │  │institutionEn│  │ nameEn      │
│ nameEs      │      │ titleEs     │      │ companyEs   │  │institutionEs│  │ nameEs      │
│ level       │      │ descriptionEn│     │ positionEn  │  │ degreeEn    │  │descriptionEn│
│ category    │      │ descriptionEs│     │ positionEs  │  │ degreeEs    │  │descriptionEs│
└─────────────┘      │ technologies│      │ descriptionEn│ │ fieldEn     │  └─────────────┘
                     │ featured    │      │ descriptionEs│ │ fieldEs     │
                     │ imageUrl    │      │ location    │  │ location    │
                     └─────────────┘      │ startDate   │  │ startDate   │
                                          │ endDate     │  │ endDate     │
                                          │ current     │  │ current     │
                                          └─────────────┘  │ gpa         │
                                                           └─────────────┘

┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Contact    │      │Testimonial  │      │   Contact   │      │   Resume    │
│    Info     │      │             │      │   Message   │      │             │
│             │      │ name        │      │ name        │      │ filename    │
│ type        │      │ position    │      │ email       │      │ fileUrl     │
│ label       │      │ company     │      │ subject     │      │ language    │
│ value       │      │ content     │      │ message     │      │ current     │
│ icon        │      │ approved ◄──┼──────┤ read        │      └─────────────┘
│ visible     │      │ imageUrl    │      └─────────────┘
└─────────────┘      └─────────────┘

             Moderation: Only approved=true visible to public
             Messages: Admin can view all, mark as read
             Resume: Only current=true shown for each language
```

---

## Frontend Component Hierarchy

```
App.jsx
├── AuthProvider
│   └── LanguageProvider
│       └── BrowserRouter
│           └── Routes
│               ├── Public Routes
│               │   ├── Home.jsx
│               │   │   ├── Header/Nav
│               │   │   ├── Hero
│               │   │   ├── Skills Section
│               │   │   ├── Projects Section
│               │   │   ├── Work Experience Section
│               │   │   ├── Education Section
│               │   │   ├── Hobbies Section
│               │   │   ├── Testimonials Section
│               │   │   ├── Contact Info Section
│               │   │   └── Footer
│               │   └── Contact.jsx
│               │       ├── Header/Nav
│               │       ├── Contact Form
│               │       └── Testimonial Form
│               │
│               └── Admin Routes (Protected)
│                   ├── AdminLogin.jsx
│                   └── ProtectedRoute
│                       ├── AdminDashboard.jsx
│                       ├── AdminSkills.jsx
│                       ├── AdminProjects.jsx
│                       ├── AdminWorkExperience.jsx
│                       ├── AdminEducation.jsx
│                       ├── AdminContactInfo.jsx
│                       ├── AdminHobbies.jsx
│                       ├── AdminTestimonials.jsx
│                       ├── AdminMessages.jsx
│                       └── AdminResumes.jsx
```

---

## Backend Module Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Initial data seeding
│
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client instance
│   │
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── skillController.js
│   │   ├── projectController.js
│   │   ├── workExperienceController.js
│   │   ├── educationController.js
│   │   ├── contactInfoController.js
│   │   ├── hobbyController.js
│   │   ├── testimonialController.js
│   │   ├── contactMessageController.js
│   │   └── resumeController.js
│   │
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── validation.js      # express-validator wrapper
│   │
│   ├── routes/                # API route definitions
│   │   ├── auth.js
│   │   ├── skills.js
│   │   ├── projects.js
│   │   ├── workExperience.js
│   │   ├── education.js
│   │   ├── contactInfo.js
│   │   ├── hobbies.js
│   │   ├── testimonials.js
│   │   ├── contactMessages.js
│   │   └── resumes.js
│   │
│   ├── utils/
│   │   ├── jwt.js             # JWT generation & verification
│   │   └── upload.js          # Multer file upload config
│   │
│   └── server.js              # Express app & server setup
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                         │
└─────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
├── HTTPS (in production)
└── CORS configuration

Layer 2: Authentication
├── JWT tokens (signed)
├── Password hashing (bcrypt)
└── Token expiration (7 days)

Layer 3: Authorization
├── Protected routes (authMiddleware)
├── Admin-only endpoints
└── Public vs. private data filtering

Layer 4: Input Validation
├── express-validator
├── Type checking
├── Range validation
└── Required field validation

Layer 5: Data Security
├── Prisma ORM (SQL injection prevention)
├── React XSS prevention (auto-escaping)
└── File upload validation

Layer 6: Content Moderation
├── Testimonial approval system
└── Admin review of contact messages

Layer 7: Environment Security
├── Environment variables
├── .gitignore for secrets
└── Different configs per environment
```

---

## Deployment Architecture

### Development
```
Localhost
├── Backend: http://localhost:5000
├── Frontend: http://localhost:5173
└── Database: localhost:5432
```

### Production (Railway + Vercel)
```
┌─────────────────────────────────────────────┐
│              Vercel CDN                     │
│         (Frontend Hosting)                  │
│    https://portfolio.vercel.app             │
└──────────────────┬──────────────────────────┘
                   │
                   │ API Calls
                   │
┌──────────────────▼──────────────────────────┐
│           Railway Platform                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Node.js Backend                   │   │
│  │   https://api.railway.app           │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │   PostgreSQL Database               │   │
│  │   (Internal Railway Network)        │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Production (Render All-in-One)
```
┌─────────────────────────────────────────────┐
│           Render Platform                   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Static Site (Frontend)            │   │
│  │   https://portfolio.onrender.com    │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │   Web Service (Backend)             │   │
│  │   https://api.onrender.com          │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │   PostgreSQL Database               │   │
│  │   (Internal Render Network)         │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Technology Stack Details

```
Frontend
├── React 19.x
│   ├── Component-based architecture
│   ├── Hooks (useState, useEffect, useContext)
│   └── Context API (Auth, Language)
├── React Router DOM 7.x
│   ├── Client-side routing
│   └── Protected routes
├── Vite 7.x
│   ├── Fast dev server
│   ├── Hot Module Replacement
│   └── Optimized production builds
├── Axios
│   ├── HTTP client
│   └── Request/response interceptors
└── Custom CSS
    ├── Responsive design
    ├── Mobile-first
    └── Flexbox & Grid layouts

Backend
├── Express.js 5.x
│   ├── RESTful API
│   ├── Middleware chain
│   └── Route handling
├── Prisma 7.x
│   ├── Type-safe ORM
│   ├── Migration system
│   └── Query builder
├── PostgreSQL
│   ├── Relational database
│   ├── ACID compliance
│   └── JSON support
├── JWT (jsonwebtoken)
│   ├── Stateless authentication
│   └── Token-based auth
├── bcryptjs
│   ├── Password hashing
│   └── Salt rounds: 10
├── Multer
│   ├── File upload handling
│   └── Storage configuration
└── express-validator
    ├── Input validation
    └── Sanitization

DevOps
├── Docker
│   └── Containerization
├── Docker Compose
│   └── Multi-container orchestration
├── Git
│   └── Version control
└── Environment Variables
    └── Configuration management
```

---

This architecture provides a solid foundation for a production-ready, scalable, and maintainable digital portfolio application.
