# Use official Node.js 20 LTS Alpine image as base
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --production

# Copy application source code
COPY . .

# Expose port (adjust if your app listens on a different port)
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the app (replace index.js with your main file if different)
CMD ["node", "index.js"]
