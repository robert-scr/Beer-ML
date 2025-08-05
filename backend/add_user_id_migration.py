#!/usr/bin/env python3
"""
Migration script to add user_id column to beer_ratings table
"""

import sqlite3
import uuid
from datetime import datetime

DATABASE_PATH = 'beer_study.db'

def add_user_id_column():
    """Add user_id column to existing beer_ratings table"""
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if user_id column already exists
        cursor.execute("PRAGMA table_info(beer_ratings)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'user_id' in columns:
            print("✅ user_id column already exists")
            return
        
        print("🔄 Adding user_id column to beer_ratings table...")
        
        # Add the user_id column with a default value
        cursor.execute("""
            ALTER TABLE beer_ratings 
            ADD COLUMN user_id VARCHAR(36) DEFAULT ''
        """)
        
        # Update existing records with unique user IDs
        # Each existing record gets its own user ID (simulating different users)
        cursor.execute("SELECT id FROM beer_ratings WHERE user_id = '' OR user_id IS NULL")
        records = cursor.fetchall()
        
        for record in records:
            record_id = record[0]
            new_user_id = str(uuid.uuid4())
            cursor.execute("""
                UPDATE beer_ratings 
                SET user_id = ? 
                WHERE id = ?
            """, (new_user_id, record_id))
        
        # Now make the column NOT NULL
        # Since SQLite doesn't support ALTER COLUMN, we need to recreate the table
        print("🔄 Making user_id column NOT NULL...")
        
        # Create a backup of the current table
        cursor.execute("""
            CREATE TABLE beer_ratings_backup AS 
            SELECT * FROM beer_ratings
        """)
        
        # Drop the original table
        cursor.execute("DROP TABLE beer_ratings")
        
        # Recreate table with proper schema including NOT NULL user_id
        cursor.execute("""
            CREATE TABLE beer_ratings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(36) NOT NULL,
                beer_name VARCHAR(100) NOT NULL,
                rating INTEGER NOT NULL,
                age INTEGER NOT NULL,
                gender VARCHAR(20) NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL,
                dark_white_chocolate INTEGER NOT NULL,
                curry_cucumber INTEGER NOT NULL,
                vanilla_lemon INTEGER NOT NULL,
                caramel_wasabi INTEGER NOT NULL,
                blue_mozzarella INTEGER NOT NULL,
                sparkling_sweet INTEGER NOT NULL,
                barbecue_ketchup INTEGER NOT NULL,
                tropical_winter INTEGER NOT NULL,
                early_night INTEGER NOT NULL,
                beer_frequency VARCHAR(20) NOT NULL,
                drinks_alcohol BOOLEAN NOT NULL,
                submitted_at DATETIME NOT NULL
            )
        """)
        
        # Copy data back from backup
        cursor.execute("""
            INSERT INTO beer_ratings 
            SELECT * FROM beer_ratings_backup
        """)
        
        # Drop backup table
        cursor.execute("DROP TABLE beer_ratings_backup")
        
        conn.commit()
        print("✅ Successfully added user_id column and updated existing records")
        
        # Show updated records
        cursor.execute("SELECT user_id, beer_name, rating FROM beer_ratings LIMIT 5")
        records = cursor.fetchall()
        
        if records:
            print("\n📊 Sample records with user_id:")
            for user_id, beer_name, rating in records:
                print(f"  User: {user_id[:8]}... | Beer: {beer_name} | Rating: {rating}")
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    print("🍺 Beer Study Database Migration - Adding user_id")
    print("=" * 50)
    add_user_id_column()
    print("\n🎉 Migration completed successfully!")
