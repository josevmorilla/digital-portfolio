# Dockerfile for backend
FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/prisma ./backend/prisma/

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
