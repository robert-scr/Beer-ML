"""
Beer Recommendation Predictor Module

This module provides a modular interface for beer prediction algorithms.
The current implementation uses similarity matching, but can be easily
replaced with more sophisticated ML models.
"""

import sqlite3
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from prompt_engineering import generate_few_shot_prompt
from json import dumps as json_dumps


class BaseBeerPredictor:
    """Base class for beer prediction algorithms."""
    
    def predict(self, user_profile: Dict) -> Dict:
        """
        Predict beer preferences for a user.
        
        Args:
            user_profile: Dictionary containing user profile and preferences
            
        Returns:
            Dictionary with prediction results
        """
        # read userprofile and delete the 'drinks_alcohol' key
        user_profile = user_profile.copy()
        user_profile.pop('drinks_alcohol', None)
        
        # convert user_profile to json
        input_features = json_dumps(user_profile)
        prompt = generate_few_shot_prompt(input_features)

        # input the string in the prompt engineering 
        return prompt


class SimilarityBeerPredictor(BaseBeerPredictor):
    """
    Beer predictor using similarity matching with existing users.
    
    This implementation finds the most similar users based on taste preferences
    and demographic data, then averages their beer ratings to make predictions.
    """
    
    def __init__(self, db_path: str = 'beer_study.db'):
        self.db_path = db_path
        self.scaler = StandardScaler()
        
    def _get_user_data(self) -> pd.DataFrame:
        """Load and preprocess user data from database."""
        conn = sqlite3.connect(self.db_path)
        
        # Get all rating data
        query = """
        SELECT DISTINCT
            user_id, age, gender, latitude, longitude,
            dark_white_chocolate, curry_cucumber, vanilla_lemon, caramel_wasabi, blue_mozzarella,
            sparkling_sweet, barbecue_ketchup, tropical_winter, early_night,
            beer_frequency, drinks_alcohol,
            beer_name, rating
        FROM beer_ratings 
        WHERE rating IS NOT NULL AND rating > 0
        """
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        return df
    
    def _preprocess_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and preprocess the data."""
        # Group by user and remove duplicates for same user-beer combinations
        # Keep the most recent rating if there are duplicates
        df_clean = df.groupby(['user_id', 'beer_name']).last().reset_index()
        
        # Get user profiles (one row per user with their taste preferences)
        user_profiles = df_clean.groupby('user_id').first().reset_index()
        
        # Get beer ratings in wide format
        beer_ratings = df_clean.pivot_table(
            index='user_id', 
            columns='beer_name', 
            values='rating'
        ).reset_index()
        
        # Fill missing ratings with mean rating for each beer
        beer_columns = [col for col in beer_ratings.columns if col != 'user_id']
        for beer_col in beer_columns:
            mean_rating = beer_ratings[beer_col].mean()
            beer_ratings[beer_col] = beer_ratings[beer_col].fillna(mean_rating)
        
        # Merge user profiles with their beer ratings
        merged_data = pd.merge(user_profiles.drop(columns=['beer_name', 'rating']), 
                              beer_ratings, on='user_id')
        
        return merged_data
    
    def _encode_categorical(self, df: pd.DataFrame) -> pd.DataFrame:
        """Encode categorical variables."""
        df_encoded = df.copy()
        
        # One-hot encode gender
        gender_dummies = pd.get_dummies(df_encoded['gender'], prefix='gender')
        df_encoded = pd.concat([df_encoded, gender_dummies], axis=1)
        df_encoded.drop('gender', axis=1, inplace=True)
        
        # One-hot encode beer_frequency
        frequency_dummies = pd.get_dummies(df_encoded['beer_frequency'], prefix='beer_frequency')
        df_encoded = pd.concat([df_encoded, frequency_dummies], axis=1)
        df_encoded.drop('beer_frequency', axis=1, inplace=True)
        
        # Convert drinks_alcohol to int (0/1)
        df_encoded['drinks_alcohol'] = df_encoded['drinks_alcohol'].astype(int)
        
        return df_encoded
    
    def _calculate_similarity(self, user_vector: np.ndarray, existing_users: np.ndarray) -> np.ndarray:
        """Calculate cosine similarity between user and existing users."""
        # Reshape user_vector to be 2D for sklearn
        user_vector = user_vector.reshape(1, -1)
        similarities = cosine_similarity(user_vector, existing_users)[0]
        return similarities
    
    def _filter_beers_by_alcohol_preference(self, beer_columns: List[str], drinks_alcohol: bool) -> List[str]:
        """Filter beers based on user's alcohol preference."""
        # Define which beers are alcoholic vs non-alcoholic
        # Beer 1-9 are alcoholic, Beer A-I are non-alcoholic
        alcoholic_beers = [f'Beer {i}' for i in range(1, 10)]
        non_alcoholic_beers = [f'Beer {chr(ord("A") + i)}' for i in range(9)]
        
        if drinks_alcohol:
            # User drinks alcohol - recommend only alcoholic beers
            filtered_beers = [beer for beer in beer_columns if beer in alcoholic_beers]
        else:
            # User doesn't drink alcohol - recommend only non-alcoholic beers
            filtered_beers = [beer for beer in beer_columns if beer in non_alcoholic_beers]
        
        return filtered_beers
    
    def predict(self, user_profile: Dict) -> Dict:
        """
        Predict beer preferences using similarity matching.
        
        Args:
            user_profile: Dict with keys: age, gender, latitude, longitude, 
                         dark_white_chocolate, curry_cucumber, vanilla_lemon, caramel_wasabi, 
                         blue_mozzarella, sparkling_sweet, barbecue_ketchup, tropical_winter, 
                         early_night, drinks_alcohol, beer_frequency
        
        Returns:
            Dict with prediction results including recommended beer and confidence
        """
        try:
            # Load and preprocess data
            raw_data = self._get_user_data()
            
            if raw_data.empty:
                return {
                    'success': False,
                    'error': 'No user data available for prediction',
                    'recommended_beer': None,
                    'confidence': 0.0,
                    'similar_users_count': 0
                }
            
            # Filter users by alcohol preference for better similarity matching
            user_drinks_alcohol = user_profile.get('drinks_alcohol', True)
            filtered_data = raw_data[raw_data['drinks_alcohol'] == user_drinks_alcohol]
            
            if filtered_data.empty:
                alcohol_type = "alcoholic" if user_drinks_alcohol else "non-alcoholic"
                return {
                    'success': False,
                    'error': f'No users with {alcohol_type} beer preferences found in database',
                    'recommended_beer': None,
                    'confidence': 0.0,
                    'similar_users_count': 0
                }
            
            processed_data = self._preprocess_data(filtered_data)
            encoded_data = self._encode_categorical(processed_data)
            
            # Separate features from beer ratings
            feature_columns = ['age', 'latitude', 'longitude', 'drinks_alcohol',
                             'dark_white_chocolate', 'curry_cucumber', 
                             'vanilla_lemon', 'caramel_wasabi', 'blue_mozzarella', 
                             'sparkling_sweet', 'barbecue_ketchup', 'tropical_winter', 
                             'early_night'] + \
                            [col for col in encoded_data.columns if col.startswith('gender_')] + \
                            [col for col in encoded_data.columns if col.startswith('beer_frequency_')]
            
            # Get all beer columns (will be filtered by alcohol preference later)
            all_beer_columns = [col for col in encoded_data.columns 
                               if col not in ['user_id'] and not col.startswith('gender_') 
                               and not col.startswith('beer_frequency_')
                               and col not in ['age', 'latitude', 'longitude', 'drinks_alcohol',
                                             'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon', 
                                             'caramel_wasabi', 'blue_mozzarella', 'sparkling_sweet',
                                             'barbecue_ketchup', 'tropical_winter', 'early_night']]
            
            # Filter beers based on user's alcohol preference
            beer_columns = self._filter_beers_by_alcohol_preference(all_beer_columns, user_drinks_alcohol)
            
            if not beer_columns:
                alcohol_type = "alcoholic" if user_drinks_alcohol else "non-alcoholic"
                return {
                    'success': False,
                    'error': f'No {alcohol_type} beer rating data available',
                    'recommended_beer': None,
                    'confidence': 0.0,
                    'similar_users_count': 0
                }
            
            # Prepare feature matrix
            X = encoded_data[feature_columns].fillna(0)
            
            # Create user vector
            user_vector = np.zeros(len(feature_columns))
            
            # Fill in user data
            for i, col in enumerate(feature_columns):
                if col == 'age':
                    user_vector[i] = user_profile.get('age', 25)  # Default age
                elif col == 'latitude':
                    user_vector[i] = user_profile.get('latitude', 0)
                elif col == 'longitude':
                    user_vector[i] = user_profile.get('longitude', 0)
                elif col == 'drinks_alcohol':
                    user_vector[i] = 1 if user_profile.get('drinks_alcohol', True) else 0
                elif col.startswith('gender_'):
                    gender_value = col.replace('gender_', '')
                    user_vector[i] = 1 if user_profile.get('gender') == gender_value else 0
                elif col.startswith('beer_frequency_'):
                    frequency_value = col.replace('beer_frequency_', '')
                    user_vector[i] = 1 if user_profile.get('beer_frequency') == frequency_value else 0
                else:
                    # Taste preference
                    user_vector[i] = user_profile.get(col, 5)  # Default to middle value
            
            # Scale features using feature names for better compatibility
            X_scaled = self.scaler.fit_transform(X)
            user_vector_scaled = self.scaler.transform(pd.DataFrame([user_vector], columns=feature_columns)).flatten()
            
            # Calculate similarities
            similarities = self._calculate_similarity(user_vector_scaled, X_scaled)
            
            # Get top 3 most similar users
            top_similar_indices = np.argsort(similarities)[-3:][::-1]  # Top 3 in descending order
            
            if len(top_similar_indices) == 0:
                return {
                    'success': False,
                    'error': 'No similar users found',
                    'recommended_beer': None,
                    'confidence': 0.0,
                    'similar_users_count': 0
                }
            
            # Get beer ratings from similar users
            similar_users_data = encoded_data.iloc[top_similar_indices]
            beer_ratings = similar_users_data[beer_columns]
            
            # Calculate mean ratings for each beer (excluding 0 ratings)
            mean_ratings = {}
            for beer in beer_columns:
                ratings = beer_ratings[beer]
                non_zero_ratings = ratings[ratings > 0]
                if len(non_zero_ratings) > 0:
                    mean_ratings[beer] = non_zero_ratings.mean()
                else:
                    mean_ratings[beer] = 0
            
            # Find the highest rated beer
            if not mean_ratings or all(rating == 0 for rating in mean_ratings.values()):
                return {
                    'success': False,
                    'error': 'No valid ratings found from similar users',
                    'recommended_beer': None,
                    'confidence': 0.0,
                    'similar_users_count': len(top_similar_indices)
                }
            
            recommended_beer = max(mean_ratings, key=mean_ratings.get)
            predicted_rating = mean_ratings[recommended_beer]
            
            # Calculate confidence based on similarity scores and number of ratings
            confidence = np.mean(similarities[top_similar_indices]) * 0.7  # Base confidence from similarity
            rating_confidence = min(predicted_rating / 10.0, 1.0) * 0.3  # Additional confidence from rating
            total_confidence = confidence + rating_confidence
            
            return {
                'success': True,
                'recommended_beer': recommended_beer,
                'predicted_rating': round(predicted_rating, 1),
                'confidence': round(total_confidence, 2),
                'similar_users_count': len(top_similar_indices),
                'similar_users_ratings': {beer: round(rating, 1) for beer, rating in mean_ratings.items() if rating > 0},
                'similarity_scores': [round(similarities[i], 2) for i in top_similar_indices]
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Prediction failed: {str(e)}',
                'recommended_beer': None,
                'confidence': 0.0,
                'similar_users_count': 0
            }


# Factory function to get predictor instance
def get_predictor(predictor_type: str = 'similarity') -> BaseBeerPredictor:
    """
    Factory function to get a predictor instance.
    
    Args:
        predictor_type: Type of predictor ('similarity', 'ml', etc.)
    
    Returns:
        Predictor instance
    """
    if predictor_type == 'similarity':
        return SimilarityBeerPredictor()
    else:
        raise ValueError(f"Unknown predictor type: {predictor_type}")
