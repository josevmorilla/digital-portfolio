# Deployment Guide

This guide covers deploying your Digital Portfolio to various hosting platforms.

## 🌐 Deployment Options

### 1. Railway + Vercel (Recommended)
- **Backend + Database**: Railway
- **Frontend**: Vercel
- **Cost**: Free tier available
- **Difficulty**: Easy

### 2. Render (All-in-One)
- **Backend + Database + Frontend**: Render
- **Cost**: Free tier available
- **Difficulty**: Easy

### 3. Heroku
- **Backend + Database**: Heroku
- **Frontend**: Vercel or Netlify
- **Cost**: Paid (Heroku no longer has free tier)
- **Difficulty**: Medium

### 4. DigitalOcean / AWS / GCP
- **Full Control**: VPS or cloud services
- **Cost**: Varies
- **Difficulty**: Advanced

---

## 🚂 Railway + Vercel Deployment (Detailed)

### Part 1: Database (Railway)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Wait for database to be created

3. **Get Database URL**
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy the `DATABASE_URL` (Postgres Connection URL)
   - Save this for later

### Part 2: Backend API (Railway)

1. **Add Backend Service**
   - In your Railway project, click "New"
   - Select "GitHub Repo"
   - Select your `digital-portfolio` repository

2. **Configure Backend Service**
   - Click on the service
   - Go to "Settings" tab
   - Set "Root Directory": leave empty (or set to `/`)
   - Set "Start Command": `npm start`

3. **Add Environment Variables**
   - Go to "Variables" tab
   - Add the following variables:
   ```
   DATABASE_URL=<paste-from-database-step>
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<generate-random-string>
   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=your-secure-password
   FRONTEND_URL=https://your-app.vercel.app
   ```

   **Generate JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Get your backend URL from "Settings" → "Domains"
   - Example: `https://your-app.up.railway.app`

5. **Run Database Migrations**
   - In Railway, open your backend service
   - Click "..." → "Settings"
   - Add deploy command in "Settings":
     - Deploy Command: `npm run prisma:generate && npm run prisma:migrate deploy && npm run prisma:seed && npm start`
   - Redeploy the service

### Part 3: Frontend (Vercel)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your `digital-portfolio` repository

3. **Configure Project**
   - Framework Preset: "Vite"
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**
   - Add environment variable:
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Your app will be live at `https://your-app.vercel.app`

6. **Update Backend CORS**
   - Go back to Railway
   - Update `FRONTEND_URL` variable with your Vercel URL
   - Redeploy backend

---

## 🎨 Render Deployment (Alternative)

### Option A: Using Web Services (Recommended)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Dashboard → "New +" → "PostgreSQL"
   - Name: `portfolio-db`
   - Database: `portfolio`
   - User: `portfolio`
   - Region: Choose closest to you
   - Plan: Free
   - Click "Create Database"
   - Copy the "Internal Database URL"

3. **Create Backend Web Service**
   - Dashboard → "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `portfolio-backend`
     - Environment: `Node`
     - Region: Same as database
     - Branch: `main`
     - Root Directory: leave empty
     - Build Command: `npm install && npm run prisma:generate`
     - Start Command: `npm run prisma:migrate deploy && npm run prisma:seed && npm start`
   
4. **Add Environment Variables (Backend)**
   ```
   DATABASE_URL=<internal-database-url-from-step-2>
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<generate-random-string>
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=change-this-password
   FRONTEND_URL=https://your-frontend.onrender.com
   ```

5. **Create Frontend Web Service**
   - Dashboard → "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - Name: `portfolio-frontend`
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`

6. **Add Environment Variables (Frontend)**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

7. **Deploy**
   - Both services will auto-deploy
   - Update backend's `FRONTEND_URL` with actual frontend URL
   - Redeploy backend

---

## ⚡ Environment Variables Reference

### Backend (.env)
```env
# Required
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key-here
NODE_ENV=production

# Optional (with defaults)
PORT=5000
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Frontend
```env
# Required
VITE_API_URL=https://your-backend-url.com
```

---

## 🔒 Security Checklist

Before going live:
- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET (32+ random characters)
- [ ] Set proper FRONTEND_URL for CORS
- [ ] Use strong database password
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Review and validate all environment variables
- [ ] Test admin login and CRUD operations
- [ ] Test file uploads
- [ ] Test contact form

---

## 🐛 Troubleshooting

### Deployment Failed
- Check build logs in your platform dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set correctly

### Database Connection Error
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/dbname`
- Ensure database is in same region as backend
- Check if migrations ran successfully

### CORS Error
- Verify FRONTEND_URL in backend matches actual frontend URL
- Check that frontend is making requests to correct backend URL
- Ensure both are using HTTPS in production

### Prisma Errors
- Ensure `prisma:generate` runs during build
- Check that migrations are applied: `prisma:migrate deploy`
- Verify DATABASE_URL is accessible from backend service

### 500 Internal Server Error
- Check backend logs in platform dashboard
- Verify all required environment variables are set
- Test database connection
- Check if seed data was created

---

## 📊 Monitoring & Logs

### Railway
- Logs: Service → "Deployments" → Click deployment → "View Logs"
- Metrics: Service → "Metrics"

### Vercel
- Logs: Project → "Deployments" → Click deployment → "View Function Logs"
- Analytics: Project → "Analytics"

### Render
- Logs: Service → "Logs" tab
- Metrics: Service → "Metrics" tab

---

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```

2. **Automatic Deployment**
   - Platforms detect push
   - Run build and deploy automatically
   - Usually takes 2-5 minutes

---

## 💰 Cost Estimates (as of 2024)

### Free Tier Limits

**Railway**
- $5 free credit per month
- ~500 hours of usage
- 1GB storage

**Vercel**
- 100GB bandwidth
- Unlimited deployments
- Good for small to medium traffic

**Render**
- Free tier available
- Services spin down after inactivity
- 90-second delay on wake up

**Recommendation**: Start with free tier, upgrade if you get significant traffic.

---

## 🚀 Post-Deployment

1. **Test Everything**
   - Admin login
   - Add/Edit/Delete content in each section
   - Upload resume
   - Submit contact form
   - Submit testimonial

2. **Add Your Content**
   - Login to admin dashboard
   - Add your actual skills, projects, etc.
   - Upload your resume
   - Update contact information

3. **Share Your Portfolio**
   - Add to your GitHub profile
   - Include in your resume
   - Share on LinkedIn
   - Add to job applications

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Check GitHub repository issues
4. Review backend logs for error details
