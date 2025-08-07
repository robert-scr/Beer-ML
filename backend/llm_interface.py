"""
LLM-based Beer Recommendation Interface

This module provides an LLM-based predictor that can be used as a drop-in
replacement for the similarity-based algorithm in predictor.py.
"""

import json
import os
import re
from typing import Dict
from openai import OpenAI
from prompt_engineering import generate_few_shot_prompt

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not available, will use os.getenv() directly
    pass


class LLMBeerPredictor:
    """
    Beer predictor using Large Language Model (LLM) with few-shot learning.
    
    This implementation uses OpenAI's API to generate beer recommendations
    based on user profiles and similar user preferences.
    """
    
    # List of valid beer names that the LLM can recommend
    VALID_BEER_NAMES = [
        "Beck's Pils",
        "Krombacher Pils", 
        "Reckendorfer Dunkel",
        "Paulaner Hefe Weißbier Naturtrüb",
        "Oettinger Weizen Hell",
        "Koestr. Schwarzbier",
        "ABT Knauer Bock",
        "Nothelfer Dunkel",
        "Staffelberg-Bräu Helle Vollbier"
    ]
    
    def __init__(self, api_key: str = None, model: str = None):
        """
        Initialize the LLM predictor.
        
        Args:
            api_key: OpenAI API key (if None, uses OPENAI_API_KEY environment variable)
            model: OpenAI model to use (if None, uses OPENAI_MODEL environment variable or defaults to gpt-4o-mini)
        """
        # Use provided API key or get from environment
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass api_key parameter.")
        
        self.client = OpenAI(api_key=self.api_key)
        
        # Use provided model or get from environment with default
        self.model = model or os.getenv('OPENAI_MODEL', 'gpt-4o-mini')
    
    def _prepare_user_profile(self, user_profile: Dict) -> Dict:
        """Prepare user profile for LLM input, removing unnecessary fields."""
        # Create a clean copy and remove drinks_alcohol as it's used for filtering
        clean_profile = user_profile.copy()
        clean_profile.pop('drinks_alcohol', None)
        return clean_profile
    
    def _extract_beer_recommendation(self, llm_response: str) -> str:
        """
        Extract beer recommendation from LLM response.
        
        Args:
            llm_response: Raw response from LLM
            
        Returns:
            Beer name (actual beer name) or None if not found
        """
        # Clean the response
        response = llm_response.strip()
        
        # Check for actual beer names in the response
        for beer_name in self.VALID_BEER_NAMES:
            if beer_name in response:
                return beer_name
        
        # Look for "Beer X" pattern and map back to actual names if needed
        beer_pattern = r'Beer\s+([1-9])\b'
        match = re.search(beer_pattern, response, re.IGNORECASE)
        
        if match:
            beer_number = int(match.group(1))
            # Map Beer X back to actual name
            if 1 <= beer_number <= len(self.VALID_BEER_NAMES):
                return self.VALID_BEER_NAMES[beer_number - 1]
        
        # Fallback: look for just numbers 1-9 and map to actual names
        number_pattern = r'\b([1-9])\b'
        matches = re.findall(number_pattern, response)
        
        if matches:
            beer_number = int(matches[0])
            if 1 <= beer_number <= len(self.VALID_BEER_NAMES):
                return self.VALID_BEER_NAMES[beer_number - 1]
        
        return None
    
    def _calculate_confidence(self, response: str, recommended_beer: str) -> float:
        """
        Calculate confidence score based on response characteristics.
        
        Args:
            response: LLM response text
            recommended_beer: Extracted beer recommendation
            
        Returns:
            Confidence score between 0 and 1
        """
        confidence = 0.5  # Base confidence
        
        # Increase confidence if response contains the recommended beer explicitly
        if recommended_beer and recommended_beer.lower() in response.lower():
            confidence += 0.2
        
        # Increase confidence if response seems decisive (contains certain keywords)
        decisive_keywords = ['recommend', 'prefer', 'best', 'ideal', 'perfect', 'suitable']
        if any(keyword in response.lower() for keyword in decisive_keywords):
            confidence += 0.2
        
        # Decrease confidence if response seems uncertain
        uncertain_keywords = ['maybe', 'perhaps', 'might', 'could', 'possibly', 'uncertain']
        if any(keyword in response.lower() for keyword in uncertain_keywords):
            confidence -= 0.2
        
        # Ensure confidence is within bounds
        return max(0.1, min(1.0, confidence))
    
    def predict(self, user_profile: Dict) -> Dict:
        """
        Predict beer preferences using LLM.
        
        Args:
            user_profile: Dict with user profile and preferences
            
        Returns:
            Dict with prediction results including recommended beer and confidence
        """
        try:
            # Prepare user profile for LLM
            clean_profile = self._prepare_user_profile(user_profile)
            
            # Convert to JSON string
            input_json = json.dumps(clean_profile, indent=2)
            
            # Generate few-shot prompt
            prompt = generate_few_shot_prompt(input_json)
            
            # Call LLM API
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,  # Low temperature for more consistent predictions
                max_tokens=100    # Short response expected
            )
            
            # Extract response
            llm_response = completion.choices[0].message.content.strip()
            
            # Extract beer recommendation
            recommended_beer = self._extract_beer_recommendation(llm_response)
            
            if not recommended_beer:
                # Provide more detailed error info for debugging
                return {
                    'success': False,
                    'error': f'Could not extract valid beer recommendation from LLM response. Expected one of: {self.VALID_BEER_NAMES}. Got: {llm_response}',
                    'recommended_beer': None,
                    'confidence': 0.0,
                    'llm_response': llm_response
                }
            
            # Calculate confidence
            confidence = self._calculate_confidence(llm_response, recommended_beer)
            
            return {
                'success': True,
                'recommended_beer': recommended_beer,
                'confidence': round(confidence, 2),
                'llm_response': llm_response,
                'model_used': self.model,
                'method': 'LLM with few-shot learning'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'LLM prediction failed: {str(e)}',
                'recommended_beer': None,
                'confidence': 0.0
            }


# Example usage and testing
if __name__ == "__main__":
    # Example for testing - uses environment variables
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
        "beer_frequency": "once_a_week",
        "drinks_alcohol": True
    }
    
    # Initialize predictor using environment variables
    try:
        predictor = LLMBeerPredictor()
        
        print("🍺 Beer Recommendation LLM Interface Test")
        print("=" * 50)
        print(f"\nInput features:\n{json.dumps(example_input, indent=2)}")
        
        # Make prediction
        result = predictor.predict(example_input)
        
        print(f"\n📝 LLM Prediction Result:")
        print("=" * 30)
        print(json.dumps(result, indent=2))
        
    except ValueError as e:
        print(f"❌ Configuration Error: {e}")
        print("\nTo fix this:")
        print("1. Copy .env.example to .env")
        print("2. Set your OpenAI API key in the .env file")
        print("3. Run the script again")


