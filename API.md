# API Documentation

Base URL: `http://localhost:5000/api` (development) or `https://your-backend-url.com/api` (production)

## Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Public Endpoints (No Authentication Required)

### Health Check
```
GET /api/health
```
Returns server status.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### Authentication

#### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@portfolio.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@portfolio.com",
    "name": "Admin User"
  }
}
```

---

### Skills

#### Get All Skills
```
GET /api/skills
```

**Response:**
```json
[
  {
    "id": "uuid",
    "nameEn": "JavaScript",
    "nameEs": "JavaScript",
    "level": 90,
    "category": "Programming",
    "icon": null,
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Skill by ID
```
GET /api/skills/:id
```

---

### Projects

#### Get All Projects
```
GET /api/projects
GET /api/projects?featured=true
```

**Query Parameters:**
- `featured` (optional): Filter featured projects only

**Response:**
```json
[
  {
    "id": "uuid",
    "titleEn": "E-commerce Platform",
    "titleEs": "Plataforma de Comercio Electrónico",
    "descriptionEn": "Full-stack e-commerce solution",
    "descriptionEs": "Solución completa de comercio electrónico",
    "imageUrl": "https://example.com/image.jpg",
    "projectUrl": "https://project.com",
    "githubUrl": "https://github.com/user/repo",
    "technologies": ["React", "Node.js", "PostgreSQL"],
    "featured": true,
    "order": 1,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Work Experience

#### Get All Work Experience
```
GET /api/work-experience
```

**Response:**
```json
[
  {
    "id": "uuid",
    "companyEn": "Tech Corp",
    "companyEs": "Tech Corp",
    "positionEn": "Senior Developer",
    "positionEs": "Desarrollador Senior",
    "descriptionEn": "Led development team...",
    "descriptionEs": "Lideré equipo de desarrollo...",
    "location": "San Francisco, CA",
    "startDate": "2020-01-01T00:00:00.000Z",
    "endDate": null,
    "current": true,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Education

#### Get All Education
```
GET /api/education
```

**Response:**
```json
[
  {
    "id": "uuid",
    "institutionEn": "University of Technology",
    "institutionEs": "Universidad de Tecnología",
    "degreeEn": "Bachelor of Science",
    "degreeEs": "Licenciatura en Ciencias",
    "fieldEn": "Computer Science",
    "fieldEs": "Ciencias de la Computación",
    "descriptionEn": "Focus on software engineering",
    "descriptionEs": "Enfoque en ingeniería de software",
    "location": "Boston, MA",
    "startDate": "2016-09-01T00:00:00.000Z",
    "endDate": "2020-05-01T00:00:00.000Z",
    "current": false,
    "gpa": "3.8",
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Contact Information

#### Get All Contact Info (Public)
```
GET /api/contact-info
```
Returns only visible contact information.

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "email",
    "label": "Email",
    "value": "contact@example.com",
    "icon": "mail",
    "order": 1,
    "visible": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Hobbies

#### Get All Hobbies
```
GET /api/hobbies
```

**Response:**
```json
[
  {
    "id": "uuid",
    "nameEn": "Photography",
    "nameEs": "Fotografía",
    "descriptionEn": "Nature and landscape photography",
    "descriptionEs": "Fotografía de naturaleza y paisajes",
    "icon": "camera",
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Testimonials

#### Get All Testimonials (Public)
```
GET /api/testimonials
```
Returns only approved testimonials for public users.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "position": "CTO",
    "company": "Tech Startup",
    "content": "Excellent work! Highly recommended.",
    "imageUrl": null,
    "approved": true,
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Submit Testimonial
```
POST /api/testimonials
```

**Request Body:**
```json
{
  "name": "John Doe",
  "position": "CTO",
  "company": "Tech Startup",
  "content": "Excellent work! Highly recommended."
}
```

**Response:**
```json
{
  "message": "Testimonial submitted successfully. It will be visible after admin approval.",
  "testimonial": { ... }
}
```

---

### Contact Messages

#### Submit Contact Message
```
POST /api/contact-messages
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Project Inquiry",
  "message": "I would like to discuss a project..."
}
```

**Response:**
```json
{
  "message": "Message sent successfully. We will get back to you soon!",
  "id": "uuid"
}
```

---

### Resumes

#### Get Current Resume by Language
```
GET /api/resumes/current/:language
```

**Parameters:**
- `language`: `en` or `es`

**Response:**
```json
{
  "id": "uuid",
  "filename": "resume-en.pdf",
  "fileUrl": "uploads/resume-123.pdf",
  "language": "en",
  "current": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Download Resume
```
GET /api/resumes/:id/download
```
Downloads the resume file.

---

## Admin Endpoints (Authentication Required)

All the following endpoints require the `Authorization: Bearer <token>` header.

### Authentication

#### Get Current User
```
GET /api/auth/me
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@portfolio.com",
    "name": "Admin User"
  }
}
```

#### Change Password
```
POST /api/auth/change-password
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

---

### Skills (Admin)

#### Create Skill
```
POST /api/skills
```

**Request Body:**
```json
{
  "nameEn": "TypeScript",
  "nameEs": "TypeScript",
  "level": 85,
  "category": "Programming",
  "icon": "typescript",
  "order": 2
}
```

#### Update Skill
```
PUT /api/skills/:id
```

**Request Body:** Same as create (all fields optional)

#### Delete Skill
```
DELETE /api/skills/:id
```

---

### Projects (Admin)

#### Create Project
```
POST /api/projects
```

**Request Body:**
```json
{
  "titleEn": "Portfolio Website",
  "titleEs": "Sitio Web de Portafolio",
  "descriptionEn": "Personal portfolio with admin dashboard",
  "descriptionEs": "Portafolio personal con panel de administración",
  "imageUrl": "https://example.com/image.jpg",
  "projectUrl": "https://portfolio.com",
  "githubUrl": "https://github.com/user/portfolio",
  "technologies": ["React", "Node.js", "PostgreSQL"],
  "featured": true,
  "order": 1,
  "startDate": "2024-01-01",
  "endDate": null
}
```

#### Update Project
```
PUT /api/projects/:id
```

#### Delete Project
```
DELETE /api/projects/:id
```

---

### Work Experience (Admin)

#### Create Work Experience
```
POST /api/work-experience
```

**Request Body:**
```json
{
  "companyEn": "Tech Corp",
  "companyEs": "Tech Corp",
  "positionEn": "Senior Developer",
  "positionEs": "Desarrollador Senior",
  "descriptionEn": "Led development team...",
  "descriptionEs": "Lideré equipo de desarrollo...",
  "location": "San Francisco, CA",
  "startDate": "2020-01-01",
  "endDate": null,
  "current": true,
  "order": 0
}
```

#### Update Work Experience
```
PUT /api/work-experience/:id
```

#### Delete Work Experience
```
DELETE /api/work-experience/:id
```

---

### Education (Admin)

#### Create Education
```
POST /api/education
```

**Request Body:**
```json
{
  "institutionEn": "University of Technology",
  "institutionEs": "Universidad de Tecnología",
  "degreeEn": "Bachelor of Science",
  "degreeEs": "Licenciatura en Ciencias",
  "fieldEn": "Computer Science",
  "fieldEs": "Ciencias de la Computación",
  "descriptionEn": "Focus on software engineering",
  "descriptionEs": "Enfoque en ingeniería de software",
  "location": "Boston, MA",
  "startDate": "2016-09-01",
  "endDate": "2020-05-01",
  "current": false,
  "gpa": "3.8",
  "order": 0
}
```

#### Update Education
```
PUT /api/education/:id
```

#### Delete Education
```
DELETE /api/education/:id
```

---

### Contact Info (Admin)

#### Get Contact Info by ID
```
GET /api/contact-info/:id
```

#### Create Contact Info
```
POST /api/contact-info
```

**Request Body:**
```json
{
  "type": "email",
  "label": "Email",
  "value": "contact@example.com",
  "icon": "mail",
  "order": 1,
  "visible": true
}
```

#### Update Contact Info
```
PUT /api/contact-info/:id
```

#### Delete Contact Info
```
DELETE /api/contact-info/:id
```

---

### Hobbies (Admin)

#### Create Hobby
```
POST /api/hobbies
```

**Request Body:**
```json
{
  "nameEn": "Photography",
  "nameEs": "Fotografía",
  "descriptionEn": "Nature photography",
  "descriptionEs": "Fotografía de naturaleza",
  "icon": "camera",
  "order": 1
}
```

#### Update Hobby
```
PUT /api/hobbies/:id
```

#### Delete Hobby
```
DELETE /api/hobbies/:id
```

---

### Testimonials (Admin)

#### Get All Testimonials (Admin)
```
GET /api/testimonials
```
Returns all testimonials (including pending ones) when authenticated.

#### Get Testimonial by ID
```
GET /api/testimonials/:id
```

#### Update Testimonial
```
PUT /api/testimonials/:id
```

**Request Body:**
```json
{
  "name": "John Doe",
  "position": "CTO",
  "company": "Tech Startup",
  "content": "Excellent work!",
  "approved": true,
  "order": 1
}
```

#### Approve Testimonial
```
POST /api/testimonials/:id/approve
```

**Response:**
```json
{
  "message": "Testimonial approved successfully",
  "testimonial": { ... }
}
```

#### Delete Testimonial
```
DELETE /api/testimonials/:id
```

---

### Contact Messages (Admin)

#### Get All Messages
```
GET /api/contact-messages
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss...",
    "read": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Message by ID
```
GET /api/contact-messages/:id
```
Automatically marks the message as read.

#### Mark as Read
```
POST /api/contact-messages/:id/read
```

#### Get Unread Count
```
GET /api/contact-messages/unread-count
```

**Response:**
```json
{
  "count": 5
}
```

#### Delete Message
```
DELETE /api/contact-messages/:id
```

---

### Resumes (Admin)

#### Get All Resumes
```
GET /api/resumes
```

#### Upload Resume
```
POST /api/resumes
Content-Type: multipart/form-data
```

**Form Data:**
- `resume`: File (PDF, DOC, DOCX)
- `language`: `en` or `es`
- `setCurrent`: `true` or `false`

**Response:**
```json
{
  "id": "uuid",
  "filename": "resume.pdf",
  "fileUrl": "uploads/resume-123.pdf",
  "language": "en",
  "current": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Resume
```
PUT /api/resumes/:id
```

**Request Body:**
```json
{
  "language": "en",
  "current": true
}
```

#### Delete Resume
```
DELETE /api/resumes/:id
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```
or
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production deployments.

## CORS

The API accepts requests from the origin specified in the `FRONTEND_URL` environment variable.
