#!/usr/bin/env python3
"""
Database migration script to update the beer study database schema
from old field names to new field names.
"""

import sqlite3
import os
import shutil
from datetime import datetime

def migrate_database():
    """Migrate the database from old schema to new schema"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'beer_study.db')
    backup_path = os.path.join(os.path.dirname(__file__), f'beer_study_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db')
    
    # Create backup first
    if os.path.exists(db_path):
        shutil.copy2(db_path, backup_path)
        print(f"Created backup: {backup_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if old table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='beer_ratings'")
        table_exists = cursor.fetchone()
        
        if table_exists:
            # Check if old columns exist (indicating old schema)
            cursor.execute("PRAGMA table_info(beer_ratings)")
            columns = [row[1] for row in cursor.fetchall()]
            
            old_columns = ['white_dark', 'curry_soup', 'lemon_vanilla', 'salmon_chicken', 
                          'cucumber_pumpkin', 'espresso_latte', 'chili_risotto', 
                          'grapefruit_banana', 'cheese_mozzarella', 'almonds_honey']
            
            has_old_schema = any(col in columns for col in old_columns)
            
            if has_old_schema:
                print("Found old schema, performing migration...")
                
                # Create new table with updated schema
                cursor.execute('''
                CREATE TABLE IF NOT EXISTS beer_ratings_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
                ''')
                
                # Migrate existing data with default values for new fields
                cursor.execute('''
                INSERT INTO beer_ratings_new (
                    id, beer_name, rating, age, gender, latitude, longitude,
                    dark_white_chocolate, curry_cucumber, vanilla_lemon, 
                    caramel_wasabi, blue_mozzarella, sparkling_sweet,
                    barbecue_ketchup, tropical_winter, early_night,
                    beer_frequency, drinks_alcohol, submitted_at
                )
                SELECT 
                    id, beer_name, rating, age, gender, latitude, longitude,
                    COALESCE(white_dark, 5), COALESCE(curry_soup, 5), COALESCE(lemon_vanilla, 5),
                    5, COALESCE(cheese_mozzarella, 5), 5,
                    5, 5, 5,
                    'rarely', 1, submitted_at
                FROM beer_ratings
                ''')
                
                # Drop old table and rename new one
                cursor.execute('DROP TABLE beer_ratings')
                cursor.execute('ALTER TABLE beer_ratings_new RENAME TO beer_ratings')
                
                print("Migration completed successfully!")
            else:
                print("Database already has new schema, no migration needed.")
        else:
            print("No existing table found, will be created with new schema.")
        
        conn.commit()
        
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
        
        # Restore backup if something went wrong
        if os.path.exists(backup_path):
            shutil.copy2(backup_path, db_path)
            print("Restored database from backup due to error.")
        
        raise e
    
    finally:
        conn.close()

if __name__ == '__main__':
    migrate_database()
