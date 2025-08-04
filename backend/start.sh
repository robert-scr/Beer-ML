#!/bin/bash

# Beer Study Backend Startup Script

echo "Starting Beer Study Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Install dependencies
echo "Installing dependencies..."
venv/bin/pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
venv/bin/python -c "
from app import app, db, enable_wal_mode
with app.app_context():
    db.create_all()
    enable_wal_mode()
    print('Database initialized successfully')
"

# Start the Flask application with Gunicorn
echo "Starting Flask application with Gunicorn..."
echo "Backend will be available at http://0.0.0.0:5000"
venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
