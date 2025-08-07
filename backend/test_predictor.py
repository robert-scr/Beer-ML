#!/usr/bin/env python3
"""
Test script for the improved beer predictor
"""

from predictor import SimilarityBeerPredictor

def test_alcoholic_prediction():
    """Test prediction for user who drinks alcohol"""
    predictor = SimilarityBeerPredictor()
    
    # User profile for someone who drinks alcohol
    alcoholic_user = {
        'age': 25,
        'gender': 'male',
        'latitude': 52.5200,
        'longitude': 13.4050,
        'dark_white_chocolate': 5,
        'curry_cucumber': 3,
        'vanilla_lemon': 7,
        'caramel_wasabi': 4,
        'blue_mozzarella': 6,
        'sparkling_sweet': 8,
        'barbecue_ketchup': 5,
        'tropical_winter': 6,
        'early_night': 4,
        'drinks_alcohol': True,
        'beer_frequency': 'often'
    }
    
    result = predictor.predict(alcoholic_user)
    print("=== ALCOHOLIC USER PREDICTION ===")
    print(f"Success: {result['success']}")
    if result['success']:
        print(f"Recommended Beer: {result['recommended_beer']}")
        print(f"Should be Beer 1-9: {result['recommended_beer'].startswith('Beer ') and result['recommended_beer'][-1].isdigit()}")
        print(f"Predicted Rating: {result['predicted_rating']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Similar Users: {result['similar_users_count']}")
    else:
        print(f"Error: {result['error']}")
    print()

def test_non_alcoholic_prediction():
    """Test prediction for user who doesn't drink alcohol"""
    predictor = SimilarityBeerPredictor()
    
    # User profile for someone who doesn't drink alcohol
    non_alcoholic_user = {
        'age': 30,
        'gender': 'female',
        'latitude': 52.5200,
        'longitude': 13.4050,
        'dark_white_chocolate': 7,
        'curry_cucumber': 6,
        'vanilla_lemon': 4,
        'caramel_wasabi': 8,
        'blue_mozzarella': 3,
        'sparkling_sweet': 9,
        'barbecue_ketchup': 2,
        'tropical_winter': 8,
        'early_night': 6,
        'drinks_alcohol': False,
        'beer_frequency': 'never'
    }
    
    result = predictor.predict(non_alcoholic_user)
    print("=== NON-ALCOHOLIC USER PREDICTION ===")
    print(f"Success: {result['success']}")
    if result['success']:
        print(f"Recommended Beer: {result['recommended_beer']}")
        print(f"Should be Beer A-I: {result['recommended_beer'].startswith('Beer ') and result['recommended_beer'][-1].isalpha()}")
        print(f"Predicted Rating: {result['predicted_rating']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Similar Users: {result['similar_users_count']}")
    else:
        print(f"Error: {result['error']}")
    print()

if __name__ == "__main__":
    test_alcoholic_prediction()
    test_non_alcoholic_prediction()
