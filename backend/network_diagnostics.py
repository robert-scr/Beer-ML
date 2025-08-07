#!/usr/bin/env python3
"""
Network Diagnostic Script for Beer Study Application
This script helps diagnose frontend-backend connectivity issues.
"""

import requests
import json
import os
import subprocess

def get_current_ip():
    """Get the current network IP address"""
    try:
        result = subprocess.run(['ip', 'addr', 'show'], capture_output=True, text=True)
        for line in result.stdout.split('\n'):
            if 'inet ' in line and 'scope global' in line:
                ip = line.split()[1].split('/')[0]
                return ip
    except:
        pass
    return "Unknown"

def check_config_files():
    """Check configuration files"""
    print("📁 Configuration Files Status:")
    print("-" * 40)
    
    # Check config.env
    config_path = "../config.env"
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            for line in f:
                if line.startswith('IP_ADDRESS='):
                    config_ip = line.split('=')[1].strip()
                    print(f"   config.env IP: {config_ip}")
                    break
    else:
        print("   ❌ config.env not found")
    
    # Check frontend .env.local
    frontend_env = "../beer-ml-frontend/.env.local"
    if os.path.exists(frontend_env):
        with open(frontend_env, 'r') as f:
            for line in f:
                if line.startswith('NEXT_PUBLIC_API_URL='):
                    frontend_url = line.split('=')[1].strip()
                    print(f"   Frontend API URL: {frontend_url}")
                    break
    else:
        print("   ❌ beer-ml-frontend/.env.local not found")

def test_backend_health(ip):
    """Test backend health endpoint"""
    url = f"http://{ip}:5000/health"
    print(f"\n🏥 Testing Backend Health: {url}")
    print("-" * 40)
    
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print("   ✅ Backend is healthy and reachable")
            return True
        else:
            print(f"   ❌ Backend responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to backend - is it running?")
        return False
    except requests.exceptions.Timeout:
        print("   ⏰ Backend request timed out")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_cors(ip):
    """Test CORS configuration"""
    url = f"http://{ip}:5000/predict"
    print(f"\n🌐 Testing CORS: {url}")
    print("-" * 40)
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': f'http://{ip}:3000',  # Simulate frontend origin
    }
    
    try:
        # Test CORS preflight
        options_response = requests.options(url, headers=headers, timeout=5)
        print(f"   CORS Preflight: {options_response.status_code}")
        
        # Test actual request
        test_data = {
            "age": 25, "gender": "female", "latitude": 52.52, "longitude": 13.405,
            "dark_white_chocolate": 5, "curry_cucumber": 5, "vanilla_lemon": 5,
            "caramel_wasabi": 5, "blue_mozzarella": 5, "sparkling_sweet": 5,
            "barbecue_ketchup": 5, "tropical_winter": 5, "early_night": 5,
            "drinks_alcohol": True, "beer_frequency": "once_a_week"
        }
        
        response = requests.post(url, headers=headers, json=test_data, timeout=10)
        print(f"   Prediction Request: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ CORS is working correctly")
            return True
        else:
            print(f"   ❌ Request failed: {response.text[:100]}")
            return False
            
    except Exception as e:
        print(f"   ❌ CORS test failed: {e}")
        return False

def main():
    print("🍺 Beer Study Network Diagnostics")
    print("=" * 50)
    
    current_ip = get_current_ip()
    print(f"🌐 Current Network IP: {current_ip}")
    
    check_config_files()
    
    backend_ok = test_backend_health(current_ip)
    cors_ok = test_cors(current_ip) if backend_ok else False
    
    print(f"\n📊 Summary")
    print("=" * 20)
    print(f"Backend Health: {'✅ OK' if backend_ok else '❌ FAILED'}")
    print(f"CORS/Frontend: {'✅ OK' if cors_ok else '❌ FAILED'}")
    
    if backend_ok and cors_ok:
        print(f"\n🎉 SUCCESS: Frontend should be able to reach backend!")
        print(f"   Frontend URL: http://{current_ip}:3000")
        print(f"   Backend URL: http://{current_ip}:5000")
    else:
        print(f"\n⚠️  Issues found. Recommendations:")
        if not backend_ok:
            print("   1. Start backend: cd backend && ./start.sh")
        if backend_ok and not cors_ok:
            print("   2. Restart backend after CORS fix")
        print("   3. Clear frontend cache: rm -rf beer-ml-frontend/.next")
        print("   4. Regenerate frontend env: ./start-frontend.sh")

if __name__ == "__main__":
    main()
