#!/usr/bin/env python3
"""
Script to process beer study data from SQLite database.
- Loads data into a dataframe
- Removes non-alcoholic beer entries (Beer A-I)
- Groups ratings per user ID
- Drops duplicates for same user/beer combinations (keeps first rating)
- Encodes each user as JSON with preferences, profile, and ratings for Beer 1-9
- Saves results to CSV
"""

import sqlite3
import pandas as pd
import json
import os
from datetime import datetime

def load_database(db_path):
    """Load beer study database into a pandas DataFrame."""
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database not found: {db_path}")
    
    conn = sqlite3.connect(db_path)
    
    # Load all data from beer_ratings table
    query = """
    SELECT 
        id, user_id, beer_name, rating,
        age, gender, latitude, longitude,
        dark_white_chocolate, curry_cucumber, vanilla_lemon, caramel_wasabi,
        blue_mozzarella, sparkling_sweet, barbecue_ketchup,
        tropical_winter, early_night, beer_frequency, drinks_alcohol,
        submitted_at
    FROM beer_ratings
    ORDER BY user_id, beer_name, submitted_at
    """
    
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    return df

def filter_alcoholic_beers(df):
    """Remove non-alcoholic beer entries (Beer A through Beer I)."""
    non_alcoholic_beers = ['Beer A', 'Beer B', 'Beer C', 'Beer D', 'Beer E', 
                          'Beer F', 'Beer G', 'Beer H', 'Beer I']
    
    # Filter out non-alcoholic beers
    alcoholic_df = df[~df['beer_name'].isin(non_alcoholic_beers)].copy()
    
    print(f"Original entries: {len(df)}")
    print(f"After removing non-alcoholic beers: {len(alcoholic_df)}")
    
    return alcoholic_df

def remove_duplicates(df):
    """Remove duplicate ratings for same user/beer combination, keeping the first one."""
    # Sort by submitted_at to ensure we keep the earliest rating
    df_sorted = df.sort_values(['user_id', 'beer_name', 'submitted_at'])
    
    # Drop duplicates based on user_id and beer_name, keeping first occurrence
    df_deduplicated = df_sorted.drop_duplicates(subset=['user_id', 'beer_name'], keep='first')
    
    print(f"After removing duplicates: {len(df_deduplicated)}")
    
    return df_deduplicated

def create_user_json_data(df):
    """Create JSON-encoded user data with preferences, profile, and ratings."""
    
    # Define the expected beer names (Beer 1-9)
    expected_beers = [f'Beer {i}' for i in range(1, 10)]
    
    user_data = []
    
    # Group by user_id
    for user_id, user_group in df.groupby('user_id'):
        # Get user profile and preferences (should be same across all entries for this user)
        first_entry = user_group.iloc[0]
        
        # Extract profile data
        profile = {
            'age': int(first_entry['age']),
            'gender': first_entry['gender'],
            'latitude': float(first_entry['latitude']),
            'longitude': float(first_entry['longitude'])
        }
        
        # Extract taste preferences
        preferences = {
            'dark_white_chocolate': int(first_entry['dark_white_chocolate']),
            'curry_cucumber': int(first_entry['curry_cucumber']),
            'vanilla_lemon': int(first_entry['vanilla_lemon']),
            'caramel_wasabi': int(first_entry['caramel_wasabi']),
            'blue_mozzarella': int(first_entry['blue_mozzarella']),
            'sparkling_sweet': int(first_entry['sparkling_sweet']),
            'barbecue_ketchup': int(first_entry['barbecue_ketchup']),
            'tropical_winter': int(first_entry['tropical_winter']),
            'early_night': int(first_entry['early_night']),
            'beer_frequency': first_entry['beer_frequency'],
            'drinks_alcohol': bool(first_entry['drinks_alcohol'])
        }
        
        # Extract ratings for Beer 1-9
        ratings = {}
        for _, row in user_group.iterrows():
            beer_name = row['beer_name']
            if beer_name in expected_beers:
                ratings[beer_name] = int(row['rating'])
        
        # Create complete user data structure
        user_json_data = {
            'user_id': user_id,
            'profile': profile,
            'preferences': preferences,
            'ratings': ratings
        }
        
        # Only include users who have rated at least one beer from Beer 1-9
        if ratings:
            user_data.append({
                'user_id': user_id,
                'user_data_json': json.dumps(user_json_data, separators=(',', ':'))
            })
    
    return pd.DataFrame(user_data)

def main():
    """Main processing function."""
    # Set paths
    db_path = os.path.join(os.path.dirname(__file__), 'beer_study.db')
    output_path = os.path.join(os.path.dirname(__file__), 'processed_beer_data.csv')
    
    print("Loading beer study database...")
    df = load_database(db_path)
    
    print(f"Loaded {len(df)} total entries")
    print(f"Unique users: {df['user_id'].nunique()}")
    print(f"Unique beers: {sorted(df['beer_name'].unique())}")
    
    print("\nFiltering out non-alcoholic beers...")
    alcoholic_df = filter_alcoholic_beers(df)
    
    print("\nRemoving duplicates...")
    clean_df = remove_duplicates(alcoholic_df)
    
    print("\nCreating JSON-encoded user data...")
    result_df = create_user_json_data(clean_df)
    
    print(f"\nFinal dataset contains {len(result_df)} users")
    
    # Save to CSV
    result_df.to_csv(output_path, index=False)
    print(f"Data saved to: {output_path}")
    
    # Display sample data
    if len(result_df) > 0:
        print(f"\nSample entry (first user):")
        sample_json = json.loads(result_df.iloc[0]['user_data_json'])
        print(json.dumps(sample_json, indent=2))
        print(f"\nNumber of ratings for first user: {len(sample_json['ratings'])}")

if __name__ == "__main__":
    main()
