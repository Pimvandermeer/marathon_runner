#!/bin/bash

# This script builds a static version of the application

# Create a clean build directory
rm -rf ./static-build
mkdir -p ./static-build

# Ensure theme.json is properly set up
echo "Checking theme configuration..."
if [ ! -f "./theme.json" ]; then
    echo "Error: theme.json not found in project root!"
    exit 1
fi

# Copy theme.json to client directory to ensure the theme plugin finds it
echo "Copying theme.json to client directory..."
cp ./theme.json ./client/theme.json

# Build using Vite directly with the client directory as root
echo "Building static version..."
cd client
npx vite build
cd ..

# Copy the CNAME file to maintain custom domain configuration
cp CNAME static-build/CNAME

# Copy the 404.html file for SPA routing
cp client/404.html static-build/404.html

# Verify the build
echo "Verifying build..."
if [ ! -f "./static-build/index.html" ]; then
    echo "Error: Build verification failed - index.html not found!"
    exit 1
fi

echo "Build completed! Your static files are in the static-build directory."
echo "You can deploy these files to any static hosting service."
