#!/usr/bin/env python3
"""
Test the backend API directly with requests
"""
import requests
import json

# Test data
test_data = {
    "age": 28,
    "gender": "female",
    "latitude": 52.52,
    "longitude": 13.405,
    "dark_white_chocolate": 6,
    "curry_cucumber": 4,
    "vanilla_lemon": 8,
    "caramel_wasabi": 3,
    "blue_mozzarella": 7,
    "sparkling_sweet": 9,
    "barbecue_ketchup": 2,
    "tropical_winter": 7,
    "early_night": 5,
    "drinks_alcohol": False,
    "beer_frequency": "never"
}

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get("http://10.100.89.181:5000/health")
        print(f"Health check: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_prediction():
    """Test the prediction endpoint"""
    try:
        response = requests.post(
            "http://10.100.89.181:5000/predict",
            headers={"Content-Type": "application/json"},
            json=test_data,
            timeout=30
        )
        print(f"Prediction request: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Prediction failed: {e}")
        return False

def main():
    print("🍺 Testing Beer Study Backend API")
    print("=" * 50)
    
    print("\n1. Testing Health Endpoint...")
    health_ok = test_health()
    
    print("\n2. Testing Prediction Endpoint...")
    pred_ok = test_prediction()
    
    print(f"\n📊 Results:")
    print(f"Health: {'✅ OK' if health_ok else '❌ FAILED'}")
    print(f"Prediction: {'✅ OK' if pred_ok else '❌ FAILED'}")
    
    if health_ok and pred_ok:
        print("\n🎉 Backend API is working correctly!")
        print("The issue is likely in the frontend configuration or CORS.")
    else:
        print("\n⚠️  Backend API has issues.")

if __name__ == "__main__":
    main()
