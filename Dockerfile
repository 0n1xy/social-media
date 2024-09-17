# Use the official Node.js image
FROM node:20

# Create and change to the app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the app code
COPY . .

# Build the TypeScript code (ensure dist folder is created)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the app from the dist folder
CMD ["node", "dist/index.js"]