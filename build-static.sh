#!/bin/bash

# This script builds a static version of the application

# Create a clean build directory
rm -rf ./static-build
mkdir -p ./static-build

# Build using Vite directly with the client directory as root
echo "Building static version..."
cd client
npx vite build
cd ..

# Copy the CNAME file to maintain custom domain configuration
cp CNAME static-build/CNAME

# Copy the 404.html file for SPA routing
cp client/404.html static-build/404.html

echo "Build completed! Your static files are in the static-build directory."
echo "You can deploy these files to any static hosting service."