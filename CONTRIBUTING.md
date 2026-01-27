# Contributing to Digital Portfolio

Thank you for your interest in contributing! This guide will help you extend and customize the portfolio.

## 🛠️ Development Setup

1. Fork and clone the repository
2. Follow QUICKSTART.md to set up the development environment
3. Create a new branch for your feature: `git checkout -b feature/my-feature`

---

## 📁 Project Architecture

### Backend Structure
```
backend/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.js            # Initial data
├── src/
│   ├── config/
│   │   └── database.js    # Prisma client
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── skillController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js        # JWT verification
│   │   └── validation.js  # Input validation
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── skills.js
│   │   └── ...
│   ├── utils/
│   │   ├── jwt.js         # JWT utilities
│   │   └── upload.js      # File upload
│   └── server.js          # Express app
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   └── ProtectedRoute.jsx
│   ├── context/           # React Context
│   │   ├── AuthContext.jsx
│   │   └── LanguageContext.jsx
│   ├── pages/
│   │   ├── public/        # Public pages
│   │   │   ├── Home.jsx
│   │   │   └── Contact.jsx
│   │   └── admin/         # Admin pages
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminSkills.jsx
│   │       └── ...
│   ├── services/
│   │   └── api.js         # API calls
│   ├── App.jsx
│   └── main.jsx
```

---

## 🎨 Common Customizations

### 1. Add a New Content Type

#### Example: Adding "Certifications"

**Step 1: Update Database Schema**
```prisma
// backend/prisma/schema.prisma
model Certification {
  id            String   @id @default(uuid())
  nameEn        String
  nameFr        String
  issuer        String
  issueDate     DateTime
  expiryDate    DateTime?
  credentialUrl String?
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Step 2: Run Migration**
```bash
npm run prisma:migrate
```

**Step 3: Create Controller**
```javascript
// backend/src/controllers/certificationController.js
const prisma = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nameEn, nameFr, issuer, issueDate, expiryDate, credentialUrl, order } = req.body;
    const certification = await prisma.certification.create({
      data: { nameEn, nameFr, issuer, issueDate: new Date(issueDate), 
              expiryDate: expiryDate ? new Date(expiryDate) : null, 
              credentialUrl, order: order || 0 }
    });
    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add update and delete methods...
```

**Step 4: Create Routes**
```javascript
// backend/src/routes/certifications.js
const express = require('express');
const certificationController = require('../controllers/certificationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', certificationController.getAll);
router.post('/', authMiddleware, certificationController.create);
// Add other routes...

module.exports = router;
```

**Step 5: Register Routes**
```javascript
// backend/src/server.js
const certificationRoutes = require('./routes/certifications');
app.use('/api/certifications', certificationRoutes);
```

**Step 6: Add Frontend API Service**
```javascript
// frontend/src/services/api.js
export const certificationsAPI = {
  getAll: () => axios.get(`${API_URL}/certifications`),
  create: (data) => axios.post(`${API_URL}/certifications`, data),
  update: (id, data) => axios.put(`${API_URL}/certifications/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/certifications/${id}`),
};
```

**Step 7: Create Admin Page**
```jsx
// frontend/src/pages/admin/AdminCertifications.jsx
// Follow the pattern from AdminSkills.jsx
```

**Step 8: Add to Public Page**
```jsx
// In frontend/src/pages/public/Home.jsx
// Add certifications section following existing patterns
```

---

### 2. Customize Styling

#### Change Color Scheme
```css
/* frontend/src/index.css */
:root {
  --primary-color: #007bff;     /* Change to your color */
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --background: #f8f9fa;
}

/* Update button styles */
button.primary {
  background-color: var(--primary-color);
}
```

#### Modify Homepage Hero
```css
/* frontend/src/pages/public/Home.css */
.hero {
  background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
  /* Or use an image */
  background-image: url('/path/to/image.jpg');
}
```

---

### 3. Add Third Language (Spanish)

**Note:** The project currently supports English and French. This example shows how to add Spanish as a third language.

**Step 1: Update Database Schema**
```prisma
// Add "Es" suffix for Spanish fields
model Skill {
  id      String @id @default(uuid())
  nameEn  String
  nameFr  String  // Current: French
  nameEs  String  // Add Spanish
  // ...
}
```

**Step 2: Run Migration**
```bash
npm run prisma:migrate
```

**Step 3: Update Language Context**
```jsx
// frontend/src/context/LanguageContext.jsx
const [language, setLanguage] = useState(() => {
  return localStorage.getItem('language') || 'en';
});

const cycleLanguage = () => {
  const languages = ['en', 'fr', 'es'];  // English, French, Spanish
  const currentIndex = languages.indexOf(language);
  const nextIndex = (currentIndex + 1) % languages.length;
  setLanguage(languages[nextIndex]);
};
```

**Step 4: Update Components**
```jsx
// In Home.jsx and other components
const t = (en, fr, es) => {
  switch(language) {
    case 'es': return es;
    case 'fr': return fr;
    default: return en;
  }
};
```

---

### 4. Add Email Notifications

**Step 1: Install Package**
```bash
npm install nodemailer
```

**Step 2: Create Email Service**
```javascript
// backend/src/utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendContactNotification = async (message) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Message: ${message.subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>From:</strong> ${message.name} (${message.email})</p>
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message}</p>
    `,
  });
};
```

**Step 3: Use in Controller**
```javascript
// backend/src/controllers/contactMessageController.js
const { sendContactNotification } = require('../utils/email');

exports.create = async (req, res) => {
  try {
    const contactMessage = await prisma.contactMessage.create({ ... });
    
    // Send email notification
    try {
      await sendContactNotification(contactMessage);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({ ... });
  } catch (error) {
    // ...
  }
};
```

---

### 5. Add Image Uploads for Projects

**Step 1: Update Upload Utility**
```javascript
// backend/src/utils/upload.js
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images allowed.'));
  }
};

exports.uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
```

**Step 2: Add Route**
```javascript
// backend/src/routes/projects.js
const upload = require('../utils/upload');

router.post(
  '/',
  authMiddleware,
  upload.uploadImage.single('image'),
  projectController.create
);
```

**Step 3: Handle in Controller**
```javascript
// backend/src/controllers/projectController.js
exports.create = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const project = await prisma.project.create({
    data: {
      ...req.body,
      imageUrl,
    },
  });
  res.status(201).json(project);
};
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit .env files
- Use strong, random JWT_SECRET
- Use different credentials for each environment

### 2. Input Validation
- Always validate on server-side
- Use express-validator for consistency
- Sanitize user inputs

### 3. Authentication
- Use HTTPS in production
- Set secure cookie flags
- Implement rate limiting for login attempts

### 4. File Uploads
- Validate file types
- Limit file sizes
- Store uploads outside web root if possible
- Scan for malware in production

---

## 📝 Code Style

### JavaScript/JSX
- Use ES6+ syntax
- Use async/await over promises
- Use meaningful variable names
- Add comments for complex logic

### Example:
```javascript
// Good
const fetchUserProjects = async (userId) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Avoid
const f = (u) => {
  return prisma.project.findMany({ where: { userId: u } });
};
```

### CSS
- Use descriptive class names
- Follow BEM naming convention when appropriate
- Group related styles together
- Add comments for complex layouts

---

## 🧪 Testing

### Before Submitting PR
1. Test all affected features
2. Check for console errors
3. Test on mobile viewport
4. Run linter (if configured)
5. Update documentation

### Adding Tests
```javascript
// Use Jest for backend tests
describe('Project Controller', () => {
  it('should create project with auth', async () => {
    // Test implementation
  });
});

// Use React Testing Library for frontend
import { render, screen } from '@testing-library/react';

test('renders project card', () => {
  render(<ProjectCard project={mockProject} />);
  expect(screen.getByText(mockProject.title)).toBeInTheDocument();
});
```

---

## 📤 Submitting Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes**
   - Follow code style
   - Add comments
   - Update documentation

3. **Test thoroughly**
   - Manual testing
   - Automated tests (if available)

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/my-feature
   ```

6. **Create Pull Request**
   - Describe what you changed
   - Explain why
   - Include screenshots if UI changes
   - Reference any issues

---

## 🐛 Reporting Issues

When reporting bugs, include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (OS, browser, Node version)
- Error messages

---

## 💡 Feature Requests

When requesting features:
- Explain the use case
- Describe the desired behavior
- Provide examples if possible
- Consider implementation complexity

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

## 📞 Questions?

- Check existing documentation
- Review closed issues on GitHub
- Ask in discussions section

---

Thank you for contributing! 🎉
