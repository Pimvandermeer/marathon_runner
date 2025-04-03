
#!/bin/bash

# This script builds the application for GitHub Pages deployment

# Create a clean build directory
rm -rf ./dist
mkdir -p ./dist

# Build the frontend only
echo "Building for GitHub Pages..."
cd client
npx vite build --outDir ../dist

# Copy the 404.html file to the dist directory for GitHub Pages SPA support
cp 404.html ../dist/404.html
cd ..

# Copy the CNAME file to maintain custom domain configuration
cp CNAME dist/CNAME

echo "Build completed successfully! The static files are in the dist directory."
echo "To deploy to GitHub Pages:"
echo "1. Create a GitHub repository for your project"
echo "2. Push this code to the repository"
echo "3. Go to repository Settings > Pages"
echo "4. Set the source to 'GitHub Actions'"
echo "5. The workflow will automatically deploy your app"
