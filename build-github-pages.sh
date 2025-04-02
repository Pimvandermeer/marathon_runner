#!/bin/bash

# This script builds the application for GitHub Pages deployment

# Create a clean build directory
rm -rf ./dist
mkdir -p ./dist

# Build the frontend only using the GitHub config
echo "Building for GitHub Pages..."
npx vite build --config vite.config.github.ts

# Move the HTML file to the root of the dist directory
if [ -f "dist/client/index.html" ]; then
  mv dist/client/index.html dist/index.html
  rmdir dist/client 2>/dev/null || true
fi

echo "Build completed successfully! The static files are in the dist directory."
echo "To deploy to GitHub Pages:"
echo "1. Create a GitHub repository for your project"
echo "2. Push this code to the repository"
echo "3. Go to repository Settings > Pages"
echo "4. Set the source to 'GitHub Actions'"
echo "5. The workflow will automatically deploy your app"