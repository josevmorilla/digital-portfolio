# AI Coding Agent Instructions - Digital Portfolio

## Project Architecture

This is a **bilingual (English/French) portfolio website** with full CRUD admin dashboard:
- **Backend**: Express.js + Prisma ORM + PostgreSQL (in `backend/`)
- **Frontend**: React + Vite + React Router (in `frontend/`)
- **Language Pattern**: All content stored bilingually (`nameEn`/`nameFr`, `titleEn`/`titleFr`, etc.) in database
- **Auth**: JWT-based authentication for admin routes only; public routes are unauthenticated

## Database Schema (Prisma)

Located in `backend/prisma/schema.prisma`. All content models follow bilingual pattern:
- `Skill`, `Project`, `WorkExperience`, `Education`, `ContactInfo`, `Hobby`, `Testimonial`, `Resume`, `ContactMessage`
- Each has bilingual fields (e.g., `nameEn`, `nameFr`, `descriptionEn`, `descriptionFr`)
- Most models include `order` field for custom sorting

**Critical**: After schema changes, ALWAYS run: `npm run prisma:generate && npm run prisma:migrate`

## Development Workflow

### Starting the Application
```bash
# Backend (from root): Terminal typically on port 5000
npm run dev

# Frontend (from frontend/): Terminal typically on port 5173
npm run dev
```

### Database Operations
```bash
# Run migrations and seed data (from root)
npm run setup

# Open Prisma Studio for data inspection
npm run prisma:studio

# Reset database (warning: destroys data)
cd backend && npx prisma migrate reset
```

## Code Patterns & Conventions

### Backend Structure
- **Routes** (`backend/src/routes/*.js`): Define public GET routes first, then protected POST/PUT/DELETE routes with `authMiddleware`
- **Controllers** (`backend/src/controllers/*Controller.js`): Export functions like `getAll`, `getById`, `create`, `update`, `delete`
- **Validation**: Use `express-validator` with `validate` middleware (see `backend/src/routes/skills.js` for pattern)
- **Auth**: Admin routes MUST use `authMiddleware` - checks JWT token from `Authorization: Bearer <token>` header

Example route pattern:
```javascript
// Public routes first
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Admin routes with auth + validation
router.post('/', authMiddleware, [validation...], validate, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);
```

### Frontend Structure
- **API Layer** (`frontend/src/services/api.js`): Centralized API calls organized by resource
- **Context**: `LanguageContext` for bilingual switching, `AuthContext` for admin authentication
- **Protected Routes**: Admin pages wrapped with `<ProtectedRoute>` component
- **Language Rendering**: Use `language === 'en' ? data.nameEn : data.nameFr` pattern throughout

### Bilingual Content Handling
When creating/updating content:
- Frontend forms MUST collect both English and French versions
- Backend validation MUST check both `*En` and `*Fr` fields
- Frontend display MUST use `LanguageContext` to select correct language field

## API Conventions

- **Public endpoints**: `/api/{resource}` (GET only)
- **Admin endpoints**: Same routes but POST/PUT/DELETE require JWT token
- **Error responses**: Always return `{ error: 'message' }` format
- **Success responses**: Return entity or array directly (no wrapper)

## File Uploads

Handled by Multer middleware in `backend/src/utils/upload.js`:
- Resumes stored in `uploads/resumes/`
- Static file serving: `/uploads` endpoint
- Remember to update `FRONTEND_URL` in `.env` for CORS

## Testing

Manual testing commands in `TESTING.md`. Key test areas:
- Auth flow: Login → Get token → Use token for admin operations
- Bilingual content: Verify both language fields save/display correctly
- Public vs Admin routes: Confirm auth middleware blocks unauthenticated admin requests

## Docker Deployment

Use `docker-compose.yml` for local development with PostgreSQL:
```bash
docker-compose up -d postgres  # Start only database
```
Backend connects via `DATABASE_URL` in `.env`

## Common Issues

1. **"column does not exist"**: Run `npm run prisma:generate` after pulling schema changes
2. **CORS errors**: Check `FRONTEND_URL` in backend `.env` matches frontend URL
3. **JWT errors**: Verify `JWT_SECRET` is set in `.env`
4. **Migration conflicts**: Use `npx prisma migrate reset` (dev only) or resolve manually

## Environment Variables

Required in backend `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Random string for token signing
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: Seed admin credentials
- `FRONTEND_URL`: For CORS (e.g., `http://localhost:5173`)
- `PORT`: Backend port (default 5000)

Frontend uses `VITE_API_URL` for custom API base (default `/api` for proxy mode)
