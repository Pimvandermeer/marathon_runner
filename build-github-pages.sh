#!/bin/bash

# This script builds the application for GitHub Pages deployment

# Create a clean build directory
rm -rf ./dist
mkdir -p ./dist

# Ensure theme.json is properly set up
echo "Checking theme configuration..."
if [ ! -f "./theme.json" ]; then
    echo "Error: theme.json not found in project root!"
    exit 1
fi

# Copy theme.json to client directory to ensure the theme plugin finds it
echo "Copying theme.json to client directory..."
cp ./theme.json ./client/theme.json

# Build the frontend using the GitHub Pages config
echo "Building for GitHub Pages..."
npx vite build --config vite.config.github.ts

# Copy the 404.html file to the dist directory for GitHub Pages SPA support
cp client/404.html dist/404.html

# Copy the CNAME file to maintain custom domain configuration
cp CNAME dist/CNAME

# Verify the build
echo "Verifying build..."
if [ ! -f "./dist/index.html" ]; then
    echo "Error: Build verification failed - index.html not found!"
    exit 1
fi

echo "Build completed successfully! The static files are in the dist directory."
echo "To deploy to GitHub Pages:"
echo "1. Create a GitHub repository for your project"
echo "2. Push this code to the repository"
echo "3. Go to repository Settings > Pages"
echo "4. Set the source to 'GitHub Actions'"
echo "5. The workflow will automatically deploy your app"
