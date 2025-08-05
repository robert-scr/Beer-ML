#!/bin/bash

echo "🍺 Beer Study Database Migration"
echo "================================"

# Navigate to backend directory
cd "$(dirname "$0")"

# Run the migration script
echo "Running database migration..."
python3 migrate_db.py

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo ""
    echo "New features added:"
    echo "- Updated taste preferences (11 features total)"
    echo "- Beer frequency question (never/rarely/often/very_often)"
    echo "- Alcohol consumption binary classifier"
    echo ""
    echo "You can now start the application with:"
    echo "  ./start.sh"
else
    echo "❌ Migration failed!"
    exit 1
fi
