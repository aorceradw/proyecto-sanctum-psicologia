# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build client
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install only production dependencies
RUN npm install --production && npm install --production --prefix server

# Copy server code
COPY server ./server

# Copy built client
COPY --from=builder /app/client/dist ./client/dist

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
