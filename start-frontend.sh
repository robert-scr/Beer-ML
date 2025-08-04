#!/bin/bash

# Beer Study Frontend Startup Script

echo "Starting Beer Study Frontend..."

# Navigate to frontend directory
cd beer-ml-frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
echo "Building application..."
npm run dev -- --hostname 0.0.0.0 --port 3000
