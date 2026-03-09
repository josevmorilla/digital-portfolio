# Dockerfile for backend (Railway deployment)
FROM node:18

WORKDIR /app

# Copy package files explicitly (no globs to avoid inadvertent copies)
COPY package.json ./
COPY package-lock.json ./
COPY backend/prisma ./backend/prisma/

# Install dependencies
RUN npm install

# Copy only the backend application code and uploads directory
COPY backend ./backend/
COPY uploads ./uploads/

# Generate Prisma client
RUN npm run prisma:generate

# Run as non-root user for security
USER node

# Railway injects PORT at runtime
EXPOSE ${PORT:-5000}

# Start: migrate DB, seed (idempotent), then run server
CMD ["npm", "start"]
