FROM node:18-alpine

WORKDIR /app

# Install Mocha globally
RUN npm install -g mocha

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Default command to run tests
CMD ["npm", "test"]
