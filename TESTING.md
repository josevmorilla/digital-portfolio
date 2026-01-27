# Testing & Validation Guide

This guide helps you test all features of the Digital Portfolio application.

## Prerequisites

- Application running (backend on port 5000, frontend on port 5173)
- Database initialized with seed data
- Admin credentials available

---

## 🧪 Manual Testing Checklist

### 1. Backend API Tests

#### Health Check

```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","message":"Server is running"}
```

#### Authentication

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"admin123"}'

# Save the token from response for next tests
TOKEN="your-token-here"

# Get current user
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### Public Endpoints

```bash
# Get all skills
curl http://localhost:5000/api/skills

# Get all projects
curl http://localhost:5000/api/projects

# Get work experience
curl http://localhost:5000/api/work-experience

# Get education
curl http://localhost:5000/api/education

# Get contact info
curl http://localhost:5000/api/contact-info

# Get hobbies
curl http://localhost:5000/api/hobbies

# Get testimonials (approved only)
curl http://localhost:5000/api/testimonials
```

#### Protected Endpoints (use TOKEN from login)

```bash
# Create skill
curl -X POST http://localhost:5000/api/skills \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nameEn":"Python","nameFr":"Python","level":85,"category":"Programming"}'

# Update skill (use actual ID)
curl -X PUT http://localhost:5000/api/skills/{skill-id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"level":90}'

# Delete skill
curl -X DELETE http://localhost:5000/api/skills/{skill-id} \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2. Frontend Tests

#### Public Pages

**Homepage (<http://localhost:5173>)**

- [ ] Page loads without errors
- [ ] Navigation menu is visible and functional
- [ ] Language switcher works (EN ↔ FR)
- [ ] All sections are displayed:
  - [ ] Hero section with title
  - [ ] Skills section with progress bars
  - [ ] Projects section with cards
  - [ ] Work experience timeline
  - [ ] Education timeline
  - [ ] Hobbies grid
  - [ ] Testimonials (only approved)
  - [ ] Contact info section
- [ ] Footer is displayed
- [ ] CV download button works (if resume uploaded)
- [ ] All content switches language correctly
- [ ] Responsive: Test on mobile viewport (< 768px)

**Contact Page (<http://localhost:5173/contact>)**

- [ ] Page loads without errors
- [ ] Contact form is displayed
- [ ] Can switch to testimonial form via tabs
- [ ] Form validation works:
  - [ ] Required fields show errors when empty
  - [ ] Email validation works
- [ ] Can submit contact message
- [ ] Success message appears after submission
- [ ] Form clears after successful submission
- [ ] Can submit testimonial
- [ ] Testimonial shows "pending approval" message
- [ ] Back to home link works
- [ ] Responsive on mobile

#### Admin Pages

**Login Page (<http://localhost:5173/admin/login>)**

- [ ] Page loads without errors
- [ ] Can enter email and password
- [ ] Validation works:
  - [ ] Shows error for invalid email
  - [ ] Shows error for empty fields
- [ ] Can login with correct credentials
- [ ] Shows error for wrong credentials
- [ ] Redirects to dashboard after successful login
- [ ] Shows default credentials info

**Admin Dashboard (<http://localhost:5173/admin>)**

- [ ] Protected: Redirects to login if not authenticated
- [ ] Shows welcome message with admin name
- [ ] All section cards are displayed
- [ ] Section cards are clickable
- [ ] Quick actions are displayed
- [ ] "View Public Site" link opens in new tab
- [ ] Logout button works
- [ ] After logout, redirected to login

**Skills CRUD (<http://localhost:5173/admin/skills>)**

- [ ] Page loads with existing skills list
- [ ] Form on left, list on right
- [ ] Can add new skill:
  - [ ] Fill all required fields
  - [ ] Submit form
  - [ ] Success message appears
  - [ ] New skill appears in list
  - [ ] Form clears after submission
- [ ] Can edit skill:
  - [ ] Click edit button
  - [ ] Form populates with skill data
  - [ ] Modify data
  - [ ] Submit
  - [ ] List updates
- [ ] Can delete skill:
  - [ ] Click delete button
  - [ ] Confirmation dialog appears
  - [ ] Confirm deletion
  - [ ] Skill removed from list
- [ ] Validation works:
  - [ ] Required fields are validated
  - [ ] Level must be 1-100
- [ ] Back to dashboard link works

---

### 3. Integration Tests

#### User Flow: Public Visitor

1. [ ] Visit homepage
2. [ ] Browse all sections
3. [ ] Switch language to Spanish
4. [ ] Verify content changes
5. [ ] Click "Contact" in menu
6. [ ] Fill contact form
7. [ ] Submit message
8. [ ] See success message
9. [ ] Switch to testimonial tab
10. [ ] Submit testimonial
11. [ ] See "pending approval" message

#### User Flow: Admin User

1. [ ] Go to admin login
2. [ ] Login with credentials
3. [ ] See dashboard
4. [ ] Go to Skills management
5. [ ] Add new skill
6. [ ] Edit the skill
7. [ ] Delete the skill
8. [ ] Go to Projects management
9. [ ] Check other sections work
10. [ ] Go to Messages
11. [ ] See submitted contact message
12. [ ] Go to Testimonials
13. [ ] See pending testimonial
14. [ ] Approve testimonial
15. [ ] Logout
16. [ ] Verify logout worked

#### User Flow: CV Download

1. [ ] Admin: Upload resume file
2. [ ] Set as current resume for language
3. [ ] Logout
4. [ ] Go to public homepage
5. [ ] See "Download CV" button
6. [ ] Click button
7. [ ] File downloads successfully

---

### 4. Database Tests

#### Using Prisma Studio

```bash
npm run prisma:studio
```

- [ ] Opens at <http://localhost:5555>
- [ ] Can view all tables
- [ ] Can view data in each table
- [ ] Can manually add/edit/delete records
- [ ] Changes reflect in application

#### Check Data

- [ ] User table has admin user
- [ ] Sample skills exist
- [ ] Sample contact info exists
- [ ] All bilingual fields have both EN and FR content

---

### 5. Security Tests

#### Authentication Security

- [ ] Cannot access admin routes without login
- [ ] Invalid token is rejected
- [ ] Expired token is rejected
- [ ] Password is hashed in database (check with Prisma Studio)
- [ ] JWT secret is configured

#### Authorization

- [ ] Public endpoints work without auth
- [ ] Admin endpoints require auth token
- [ ] CORS is configured correctly
- [ ] Cannot see unapproved testimonials publicly
- [ ] Cannot see hidden contact info publicly

#### Input Validation

- [ ] Server validates all inputs
- [ ] SQL injection prevented (Prisma ORM)
- [ ] XSS prevented (React escapes by default)
- [ ] File upload only accepts specified types
- [ ] File size limits are enforced

---

### 6. Responsive Design Tests

Test on different viewports:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Check:

- [ ] Navigation adapts on mobile
- [ ] Cards stack properly
- [ ] Forms are usable
- [ ] Buttons are tappable
- [ ] Text is readable
- [ ] Images scale properly
- [ ] No horizontal scroll

---

### 7. Browser Compatibility

Test on:

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

### 8. Performance Tests

#### Load Times

- [ ] Homepage loads in < 3 seconds
- [ ] Admin dashboard loads in < 2 seconds
- [ ] API responses < 500ms

#### Optimization

- [ ] Images are optimized
- [ ] CSS is minified in production build
- [ ] JavaScript is minified in production build
- [ ] No console errors
- [ ] No console warnings (except expected ones)

---

### 9. Error Handling Tests

#### Network Errors

- [ ] Stop backend server
- [ ] Try to load frontend
- [ ] Should show loading state or error
- [ ] Start backend
- [ ] Frontend recovers

#### Invalid Data

- [ ] Submit form with invalid data
- [ ] Error messages are clear
- [ ] Can correct and resubmit

#### 404 Pages

- [ ] Visit non-existent route
- [ ] Redirects to home or shows 404

---

## 🔧 Automated Testing (Optional)

### Backend API Tests

You can add automated tests using Jest or Mocha:

```javascript
// Example test structure
describe('Skills API', () => {
  it('should get all skills', async () => {
    const response = await request(app).get('/api/skills');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create skill with auth', async () => {
    const response = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nameEn: 'Test Skill',
        nameEs: 'Habilidad de Prueba',
        level: 75,
        category: 'Testing'
      });
    expect(response.status).toBe(201);
  });
});
```

### Frontend Tests

Using React Testing Library:

```javascript
// Example component test
import { render, screen } from '@testing-library/react';
import Home from './pages/public/Home';

test('renders homepage', () => {
  render(<Home />);
  const heading = screen.getByText(/Portfolio/i);
  expect(heading).toBeInTheDocument();
});
```

---

## 📊 Testing Report Template

After testing, document results:

```markdown
## Testing Report

**Date:** [Date]
**Tester:** [Name]
**Environment:** [Local/Staging/Production]

### Summary
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X

### Issues Found
1. **Issue Title**
   - Severity: High/Medium/Low
   - Description: ...
   - Steps to Reproduce: ...
   - Expected: ...
   - Actual: ...

### Recommendations
- ...
```

---

## 🐛 Common Issues & Solutions

### Backend won't start

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check port 5000 is free
lsof -ti:5000 | xargs kill -9

# Check .env file exists
cat .env

# Regenerate Prisma client
npm run prisma:generate
```

### Frontend won't start

```bash
# Check port 5173 is free
lsof -ti:5173 | xargs kill -9

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database errors

```bash
# Reset database
npm run prisma:migrate reset

# Reseed database
npm run prisma:seed
```

### CORS errors

- Check FRONTEND_URL in backend .env
- Check VITE_API_URL in frontend
- Ensure both URLs match deployment URLs

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All manual tests pass
- [ ] No console errors
- [ ] All forms validated
- [ ] Authentication works
- [ ] Database migrations work
- [ ] Seed data works
- [ ] Environment variables configured
- [ ] Admin password changed
- [ ] HTTPS enabled
- [ ] CORS configured for production
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Responsive on all devices
- [ ] Documentation updated
