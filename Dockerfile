# Dockerfile for backend (Railway deployment)
FROM node:18

WORKDIR /app

# Copy package files (including lock file for reproducible installs)
COPY package.json package-lock.json* ./
COPY backend/prisma ./backend/prisma/

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Railway injects PORT at runtime
EXPOSE ${PORT:-5000}

# Start: migrate DB, seed (idempotent), then run server
CMD ["npm", "start"]
