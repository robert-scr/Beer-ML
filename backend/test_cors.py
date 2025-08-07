#!/usr/bin/env python3
"""
Simple test to verify CORS and network connectivity from frontend perspective
"""
import requests
import json

def test_cors_from_frontend():
    """Test CORS by simulating a frontend request"""
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://10.100.89.181:3000',  # Simulate frontend origin
        'Referer': 'http://10.100.89.181:3000/'
    }
    
    test_data = {
        "age": 25,
        "gender": "female",
        "latitude": 52.52,
        "longitude": 13.405,
        "dark_white_chocolate": 5,
        "curry_cucumber": 5,
        "vanilla_lemon": 5,
        "caramel_wasabi": 5,
        "blue_mozzarella": 5,
        "sparkling_sweet": 5,
        "barbecue_ketchup": 5,
        "tropical_winter": 5,
        "early_night": 5,
        "drinks_alcohol": True,
        "beer_frequency": "once_a_week"
    }
    
    try:
        print("🌐 Testing CORS and Network Connectivity")
        print("=" * 50)
        print(f"Frontend URL: http://10.100.89.181:3000")
        print(f"Backend URL: http://10.100.89.181:5000")
        print()
        
        # Test OPTIONS request (CORS preflight)
        print("1. Testing CORS preflight (OPTIONS)...")
        options_response = requests.options(
            "http://10.100.89.181:5000/predict",
            headers=headers,
            timeout=5
        )
        print(f"   Status: {options_response.status_code}")
        print(f"   CORS headers: {dict(options_response.headers)}")
        
        # Test actual POST request
        print("\n2. Testing prediction request (POST)...")
        response = requests.post(
            "http://10.100.89.181:5000/predict",
            headers=headers,
            json=test_data,
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            print("\n✅ SUCCESS: Frontend can reach backend!")
        else:
            print(f"\n❌ FAILED: HTTP {response.status_code}")
            
    except requests.exceptions.Timeout:
        print("\n⏰ TIMEOUT: Request took too long (>10s)")
        print("   This might indicate the LLM predictor is slow")
    except requests.exceptions.ConnectionError:
        print("\n🔌 CONNECTION ERROR: Cannot reach backend")
        print("   Check if backend is running on http://10.100.89.181:5000")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_cors_from_frontend()
