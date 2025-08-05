#!/bin/bash

# Beer Study Frontend Startup Script

echo "🍺 Starting Beer Study Frontend..."

# Load configuration from root config.env
if [ -f "config.env" ]; then
    echo "📝 Loading configuration from config.env..."
    
    # Parse config file (shell-agnostic)
    IP_ADDRESS=$(grep "^IP_ADDRESS=" config.env | cut -d'=' -f2)
    BACKEND_PORT=$(grep "^BACKEND_PORT=" config.env | cut -d'=' -f2)
    FRONTEND_PORT=$(grep "^FRONTEND_PORT=" config.env | cut -d'=' -f2)
    
    # Build URLs
    API_URL="http://${IP_ADDRESS}:${BACKEND_PORT}"
    FRONTEND_URL="http://${IP_ADDRESS}:${FRONTEND_PORT}"
    
    # Generate .env.local file automatically
    echo "🔧 Generating frontend environment configuration..."
    cat > beer-ml-frontend/.env.local << EOF
# Auto-generated from config.env - DO NOT EDIT MANUALLY
# To change the IP address, edit config.env in the root directory
NEXT_PUBLIC_API_URL=${API_URL}
EOF
    echo "✅ Frontend environment configured with API URL: ${API_URL}"
else
    echo "❌ config.env not found! Please create it with your IP address configuration."
    exit 1
fi

# Navigate to frontend directory
cd beer-ml-frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🚀 Starting development server on ${FRONTEND_URL}..."
npm run dev -- --hostname 0.0.0.0 --port ${FRONTEND_PORT}
