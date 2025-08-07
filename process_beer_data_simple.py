#!/usr/bin/env python3
"""
Script to process beer study data from SQLite database into a clean CSV format.
- Loads data into a dataframe
- Removes non-alcoholic beer entries (Beer A-I)  
- Groups ratings per user ID
- Drops duplicates for same user/beer combinations (keeps first rating)
- Creates CSV with schema header and user data rows (no IDs)
- Each row represents one user with their profile, preferences, and Beer 1-9 ratings
"""

import sqlite3
import pandas as pd
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
        user_id, beer_name, rating,
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

def create_user_rows(df):
    """Create user data rows with profile, preferences, and Beer 1-9 ratings."""
    
    # Define the expected beer names (Beer 1-9)
    expected_beers = [f'Beer {i}' for i in range(1, 10)]
    
    user_rows = []
    
    # Group by user_id
    for user_id, user_group in df.groupby('user_id'):
        # Get user profile and preferences (should be same across all entries for this user)
        first_entry = user_group.iloc[0]
        
        # Start building the user row with profile and preferences
        user_row = [
            int(first_entry['age']),                    # age
            first_entry['gender'],                      # gender
            float(first_entry['latitude']),             # latitude
            float(first_entry['longitude']),            # longitude
            int(first_entry['dark_white_chocolate']),   # dark_white_chocolate
            int(first_entry['curry_cucumber']),         # curry_cucumber
            int(first_entry['vanilla_lemon']),          # vanilla_lemon
            int(first_entry['caramel_wasabi']),         # caramel_wasabi
            int(first_entry['blue_mozzarella']),        # blue_mozzarella
            int(first_entry['sparkling_sweet']),        # sparkling_sweet
            int(first_entry['barbecue_ketchup']),       # barbecue_ketchup
            int(first_entry['tropical_winter']),        # tropical_winter
            int(first_entry['early_night']),            # early_night
            first_entry['beer_frequency'],              # beer_frequency
            bool(first_entry['drinks_alcohol'])         # drinks_alcohol
        ]
        
        # Extract ratings for Beer 1-9 in order
        ratings_dict = {}
        for _, row in user_group.iterrows():
            beer_name = row['beer_name']
            if beer_name in expected_beers:
                ratings_dict[beer_name] = int(row['rating'])
        
        # Add ratings in Beer 1-9 order, use None for missing ratings
        for beer_name in expected_beers:
            if beer_name in ratings_dict:
                user_row.append(ratings_dict[beer_name])
            else:
                user_row.append(None)  # Missing rating
        
        # Only include users who have rated at least one beer from Beer 1-9
        if any(rating is not None for rating in user_row[-9:]):
            user_rows.append(user_row)
    
    return user_rows

def create_schema_header():
    """Create the schema header describing each column."""
    schema = [
        "age",                    # User age (integer)
        "gender",                 # User gender (string)
        "latitude",               # Location latitude (float)
        "longitude",              # Location longitude (float)
        "dark_white_chocolate",   # Taste preference: Dark Chocolate (1) ↔ White Chocolate (10)
        "curry_cucumber",         # Taste preference: Curry (1) ↔ Cucumber salad (10)
        "vanilla_lemon",          # Taste preference: Vanilla ice cream (1) ↔ Lemon sorbet (10)
        "caramel_wasabi",         # Taste preference: Caramel popcorn (1) ↔ Wasabi peas (10)
        "blue_mozzarella",        # Taste preference: Blue cheese (1) ↔ Fresh mozzarella (10)
        "sparkling_sweet",        # Taste preference: Sparkling water (1) ↔ Sweet soda (10)
        "barbecue_ketchup",       # Taste preference: Barbecue sauce (1) ↔ Tomato ketchup (10)
        "tropical_winter",        # Taste preference: Tropical paradise (1) ↔ Winter wonderland (10)
        "early_night",            # Taste preference: Early bird (1) ↔ Night out (10)
        "beer_frequency",         # Beer consumption frequency (never/rarely/often/very_often)
        "drinks_alcohol",         # Whether user drinks alcohol (boolean)
        "beer_1_rating",          # Rating for Beer 1 (1-10 scale)
        "beer_2_rating",          # Rating for Beer 2 (1-10 scale)
        "beer_3_rating",          # Rating for Beer 3 (1-10 scale)
        "beer_4_rating",          # Rating for Beer 4 (1-10 scale)
        "beer_5_rating",          # Rating for Beer 5 (1-10 scale)
        "beer_6_rating",          # Rating for Beer 6 (1-10 scale)
        "beer_7_rating",          # Rating for Beer 7 (1-10 scale)
        "beer_8_rating",          # Rating for Beer 8 (1-10 scale)
        "beer_9_rating"           # Rating for Beer 9 (1-10 scale)
    ]
    
    return schema

def main():
    """Main processing function."""
    # Set paths
    db_path = os.path.join(os.path.dirname(__file__), 'beer_study.db')
    output_path = os.path.join(os.path.dirname(__file__), 'beer_study_processed.csv')
    
    print("Loading beer study database...")
    df = load_database(db_path)
    
    print(f"Loaded {len(df)} total entries")
    print(f"Unique users: {df['user_id'].nunique()}")
    print(f"Unique beers: {sorted(df['beer_name'].unique())}")
    
    print("\nFiltering out non-alcoholic beers...")
    alcoholic_df = filter_alcoholic_beers(df)
    
    print("\nRemoving duplicates...")
    clean_df = remove_duplicates(alcoholic_df)
    
    print("\nCreating user data rows...")
    user_rows = create_user_rows(clean_df)
    
    print(f"\nProcessed {len(user_rows)} users")
    
    # Create the CSV with schema header and data rows
    schema_header = create_schema_header()
    
    # Write to CSV manually to have full control over format
    with open(output_path, 'w', newline='') as csvfile:
        import csv
        writer = csv.writer(csvfile)
        
        # Write schema header
        writer.writerow(schema_header)
        
        # Write user data rows
        for user_row in user_rows:
            writer.writerow(user_row)
    
    print(f"Data saved to: {output_path}")
    
    # Display some statistics
    if len(user_rows) > 0:
        print(f"\nDataset statistics:")
        print(f"- Number of users: {len(user_rows)}")
        print(f"- Columns per user: {len(schema_header)}")
        
        # Count complete vs incomplete users
        complete_users = 0
        for user_row in user_rows:
            beer_ratings = user_row[-9:]  # Last 9 columns are beer ratings
            if all(rating is not None for rating in beer_ratings):
                complete_users += 1
        
        print(f"- Users with all 9 beer ratings: {complete_users}")
        print(f"- Users with partial ratings: {len(user_rows) - complete_users}")
        
        # Show first few rows as sample
        print(f"\nFirst user data sample:")
        first_user = user_rows[0]
        for i, (field, value) in enumerate(zip(schema_header, first_user)):
            print(f"  {field}: {value}")

if __name__ == "__main__":
    main()
