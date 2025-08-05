#!/bin/bash

# Beer Study Backend Startup Script

echo "🍺 Starting Beer Study Backend..."

# Load configuration from root config.env
if [ -f "../config.env" ]; then
    echo "📝 Loading configuration from config.env..."
    
    # Parse config file (shell-agnostic)
    IP_ADDRESS=$(grep "^IP_ADDRESS=" ../config.env | cut -d'=' -f2)
    BACKEND_PORT=$(grep "^BACKEND_PORT=" ../config.env | cut -d'=' -f2)
    
    # Build URLs
    API_URL="http://${IP_ADDRESS}:${BACKEND_PORT}"
    
    echo "✅ Backend will be available at ${API_URL}"
else
    echo "❌ config.env not found! Using default configuration."
    IP_ADDRESS="localhost"
    BACKEND_PORT=5000
    API_URL="http://${IP_ADDRESS}:${BACKEND_PORT}"
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🐍 Creating virtual environment..."
    python3 -m venv venv
fi

# Install dependencies
echo "📦 Installing dependencies..."
venv/bin/pip install -r requirements.txt

# Initialize database
echo "🗄️ Initializing database..."
venv/bin/python -c "
from app import app, db, enable_wal_mode
with app.app_context():
    db.create_all()
    enable_wal_mode()
    print('Database initialized successfully')
"

# Start the Flask application with Gunicorn
echo "🚀 Starting Flask application with Gunicorn..."
echo "Backend available at: ${API_URL}"
venv/bin/gunicorn -w 4 -b 0.0.0.0:${BACKEND_PORT} app:app
