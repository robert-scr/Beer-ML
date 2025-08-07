#!/usr/bin/env python3
"""
Alcoholic Beer Recommendation Prompt Engineering for Few-Shot Learning

This script generates LLM prompts for alcoholic beer recommendation using few-shot learning
based on user features and similar user preferences from alcohol-drinking users.
"""

import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import os

def load_processed_data():
    """Load the processed alcoholic beer data"""
    csv_path = os.path.join(os.path.dirname(__file__), 'alc_df_userbased.csv')
    df = pd.read_csv(csv_path)
    
    return df

def find_similar_users(input_features, df, n_similar=10):
    """Find the most similar users based on input features"""
    
    # Feature columns to use for similarity
    feature_cols = ['age', 'gender', 'latitude', 'longitude',
                   'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon',
                   'caramel_wasabi', 'blue_mozzarella', 'sparkling_sweet',
                   'barbecue_ketchup', 'tropical_winter', 'early_night', 'beer_frequency']
    
    # Encode gender if it's categorical
    df_features = df[feature_cols].copy()
    if df_features['gender'].dtype == 'object':
        df_features['gender'] = df_features['gender'].map({'male': 0, 'female': 1, 'prefer-not-to-say': 2})
    
    # Encode beer_frequency if it's categorical
    if df_features['beer_frequency'].dtype == 'object':
        freq_mapping = {
            'never': 0, 
            'once_a_month': 1, 
            'once_a_week': 2, 
            'multiple_times_a_week': 3
        }
        df_features['beer_frequency'] = df_features['beer_frequency'].map(freq_mapping)
    
    # Handle input features encoding
    input_vector = input_features.copy()
    if isinstance(input_vector['gender'], str):
        input_vector['gender'] = 1 if input_vector['gender'].lower() == 'female' else 0
    if isinstance(input_vector['beer_frequency'], str):
        freq_mapping = {
            'never': 0, 
            'once_a_month': 1, 
            'once_a_week': 2, 
            'multiple_times_a_week': 3
        }
        input_vector['beer_frequency'] = freq_mapping.get(input_vector['beer_frequency'].lower(), 1)
    
    # Standardize features for similarity calculation
    scaler = StandardScaler()
    df_features_scaled = scaler.fit_transform(df_features)
    
    # Scale input vector
    input_scaled = scaler.transform([[input_vector[col] for col in feature_cols]])
    # 
    
    # Calculate cosine similarity
    similarities = cosine_similarity(input_scaled, df_features_scaled)[0]
    
    # Get indices of most similar users
    similar_indices = np.argsort(similarities)[::-1][:n_similar]
    
    return df.iloc[similar_indices], similarities[similar_indices]

def get_preferred_beer(user_row):
    """Get the beer with highest rating for a user (Beer 1-9)"""
    beer_cols = [col for col in user_row.index if col.startswith('Beer ') and col.split(' ')[1].isdigit()]
    
    if not beer_cols:
        return "Unknown"
    
    # Get ratings for beer columns, handling NaN values
    beer_ratings = user_row[beer_cols].dropna()
    
    if beer_ratings.empty:
        return "Unknown"
    
    # Find beer with highest rating
    max_rating = beer_ratings.max()
    preferred_beers = beer_ratings[beer_ratings == max_rating]
    
    # Return the first beer if there are ties
    return preferred_beers.index[0]

def format_user_example(user_row, similarity_score=None):
    """Format a single user example for the prompt"""
    
    # Extract features
    features = {
        'age': int(user_row['age']),
        'gender': user_row['gender'],
        'latitude': round(float(user_row['latitude']), 4),
        'longitude': round(float(user_row['longitude']), 4),
        'dark_white_chocolate': int(user_row['dark_white_chocolate']),
        'curry_cucumber': int(user_row['curry_cucumber']),
        'vanilla_lemon': int(user_row['vanilla_lemon']),
        'caramel_wasabi': int(user_row['caramel_wasabi']),
        'blue_mozzarella': int(user_row['blue_mozzarella']),
        'sparkling_sweet': int(user_row['sparkling_sweet']),
        'barbecue_ketchup': int(user_row['barbecue_ketchup']),
        'tropical_winter': int(user_row['tropical_winter']),
        'early_night': int(user_row['early_night']),
        'beer_frequency': user_row['beer_frequency']
    }
    
    preferred_beer = get_preferred_beer(user_row)
    
    example = f"""Input: {json.dumps(features, indent=2)}
Output: {preferred_beer}"""
    
    return example

def generate_few_shot_prompt(input_features_json):
    """Generate a few-shot learning prompt for beer recommendation"""
    
    # Parse input JSON
    try:
        input_features = json.loads(input_features_json)
    except json.JSONDecodeError:
        return "Error: Invalid JSON input"
    
    # Load data
    df = load_processed_data()
    
    
    # Find similar users
    similar_users, similarities = find_similar_users(input_features, df, n_similar=10)
    
    # Generate few-shot examples
    examples = []
    for i, (_, user_row) in enumerate(similar_users.iterrows()):
        example = format_user_example(user_row, similarities[i])
        examples.append(example)
    
    # Create the final prompt
    prompt = f"""You are a beer recommendation expert. Based on user preferences and demographics, predict which beer (Beer 1 through Beer 9) they would prefer most.

The input features represent:
- age: User's age
- gender: User's gender (male/female)
- latitude/longitude: User's location coordinates
- Taste preferences (scale 0-10): dark_white_chocolate, curry_cucumber, vanilla_lemon, caramel_wasabi, blue_mozzarella, sparkling_sweet, barbecue_ketchup, tropical_winter, early_night
- beer_frequency: How often they drink beer (never, once_a_month, once_a_week, multiple_times_a_week)

Here are examples of similar users and their preferred beers:

{chr(10).join(examples)}

Now predict the preferred beer for this new user:

Input: {json.dumps(input_features, indent=2)}
Output:"""
    
    return prompt

def main():
    """Example usage"""
    
    # Example input features
    example_input = {
        "age": 25,
        "gender": "female",
        "latitude": 52.5200,
        "longitude": 13.4050,
        "dark_white_chocolate": 7,
        "curry_cucumber": 3,
        "vanilla_lemon": 5,
        "caramel_wasabi": 2,
        "blue_mozzarella": 8,
        "sparkling_sweet": 6,
        "barbecue_ketchup": 4,
        "tropical_winter": 7,
        "early_night": 1,
        "beer_frequency": "once_a_week"
    }
    
    # Convert to JSON string
    input_json = json.dumps(example_input, indent=2)
    
    print("🍺 Beer Recommendation Prompt Generator")
    print("=" * 50)
    print(f"\nInput features:\n{input_json}")
    
    # Generate prompt
    prompt = generate_few_shot_prompt(input_json)
    
    print(f"\n📝 Generated Few-Shot Prompt:")
    print("=" * 50)
    print(prompt)
    
    # Save prompt to file
    timestamp = pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')
    prompt_file = os.path.join(os.path.dirname(__file__), f'beer_recommendation_prompt_{timestamp}.txt')
    
    with open(prompt_file, 'w', encoding='utf-8') as f:
        f.write("BEER RECOMMENDATION FEW-SHOT PROMPT\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Generated: {pd.Timestamp.now()}\n\n")
        f.write("INPUT FEATURES:\n")
        f.write(input_json + "\n\n")
        f.write("GENERATED PROMPT:\n")
        f.write("-" * 30 + "\n")
        f.write(prompt)
    
    print(f"\n💾 Prompt saved to: {os.path.basename(prompt_file)}")

if __name__ == "__main__":
    main()
