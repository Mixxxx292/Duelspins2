#!/bin/bash

export NODE_OPTIONS=--openssl-legacy-provider

echo "Starting build and deployment process..."

# Set environment variables if needed
export NODE_ENV=production

# Navigate to the client directory and build
cd client
npm run build

# Navigate back to the root directory
cd ..

# Navigate to the server directory and build
cd server
npm run build

# Start the server in the background
npm start &

# Navigate back to the client directory
cd ../client

# Start the client in development mode
npm start

echo "Build and deployment process completed successfully!"
