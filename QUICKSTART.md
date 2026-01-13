# Quick Start Guide

## 🚀 Quick Start (3 options)

### Option 1: Local Development (Recommended for development)

**Prerequisites:** Node.js, PostgreSQL

```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup database
npm run setup

# 4. Start servers (2 terminals)
# Terminal 1:
npm run dev

# Terminal 2:
cd frontend && npm run dev
```

Visit: http://localhost:5173

### Option 2: Docker (Easiest - all-in-one)

**Prerequisites:** Docker, Docker Compose

```bash
# 1. Start everything
docker-compose up -d

# 2. Wait for services to be ready (1-2 minutes)
docker-compose logs -f backend

# 3. Access the app
```

Visit: http://localhost:3000

### Option 3: Cloud Deployment (Production)

#### Railway (Recommended)

1. **Create Railway Account**: https://railway.app
2. **Create PostgreSQL Database**:
   - Click "New Project"
   - Add "PostgreSQL"
   - Copy the DATABASE_URL
3. **Deploy Backend**:
   - Add "GitHub Repo"
   - Select your repo
   - Set environment variables:
     ```
     DATABASE_URL=<from-railway-postgres>
     JWT_SECRET=your-random-secret-key
     ADMIN_EMAIL=admin@portfolio.com
     ADMIN_PASSWORD=change-this-password
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Railway will auto-deploy
4. **Deploy Frontend** (Vercel):
   - Go to https://vercel.com
   - Import your GitHub repo
   - Set root directory to `frontend`
   - Add environment variable:
     ```
     VITE_API_URL=<your-railway-backend-url>
     ```
   - Deploy!

## 📱 Default Admin Access

After setup, login at `/admin/login`:
- **Email**: admin@portfolio.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

## ✅ Verify Installation

1. **Backend Health Check**: 
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

2. **Database Connection**:
   ```bash
   npm run prisma:studio
   ```
   Opens Prisma Studio at http://localhost:5555

3. **Admin Login**: Visit http://localhost:5173/admin/login

## 🔧 Common Issues

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                 # macOS

# Reset database
npm run prisma:migrate reset
npm run prisma:seed
```

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Prisma Client Error
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

## 📚 Next Steps

1. **Change Admin Password**: Login → Settings → Change Password
2. **Add Your Content**: Use admin dashboard to add skills, projects, etc.
3. **Upload Resume**: Admin → Resumes → Upload your CV
4. **Customize Branding**: Edit colors in CSS files
5. **Deploy to Production**: Follow Option 3 above

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints in README.md
- Check backend logs: `npm run dev` (shows API errors)
- Check frontend console: Browser DevTools → Console
- Database GUI: `npm run prisma:studio`

## 🔐 Security Checklist

Before deploying to production:
- [ ] Change default admin password
- [ ] Set strong JWT_SECRET in .env
- [ ] Update CORS origin (FRONTEND_URL)
- [ ] Review and set proper database credentials
- [ ] Enable HTTPS (automatic on Railway/Vercel)
- [ ] Set NODE_ENV=production
