#!/bin/sh

export NODE_OPTIONS=--openssl-legacy-provider
echo "Starting build process..."

# Navigate to the client directory and build
cd client
npm run build

# Navigate back to the root directory
cd ..

# Navigate to the server directory and build
cd server
npm run build

echo "Build process completed successfully!"
