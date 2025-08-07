from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
import sqlite3
from predictor import get_predictor

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not available, will use os.getenv() directly
    pass

app = Flask(__name__)

# Predictor Configuration - Load from environment
PREDICTOR_TYPE = os.getenv('PREDICTOR_TYPE', 'similarity')  # 'similarity' or 'llm'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')

def get_configured_predictor():
    """Get predictor instance based on environment configuration."""
    try:
        if PREDICTOR_TYPE.lower() == 'llm':
            if not OPENAI_API_KEY:
                print("⚠️  Warning: LLM predictor selected but OPENAI_API_KEY not set. Falling back to similarity predictor.")
                return get_predictor('similarity')
            
            print(f"🤖 Using LLM predictor with model: {OPENAI_MODEL}")
            return get_predictor('llm', api_key=OPENAI_API_KEY, model=OPENAI_MODEL)
        else:
            print("🔍 Using similarity-based predictor")
            return get_predictor('similarity')
    except Exception as e:
        print(f"❌ Error initializing {PREDICTOR_TYPE} predictor: {e}")
        print("🔄 Falling back to similarity predictor")
        return get_predictor('similarity')

# Configure CORS to allow frontend requests
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000", 
            "http://127.0.0.1:3000",
            "http://10.100.89.181:3000",  # Network IP
            "*"  # Allow all origins for development
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Database configuration
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'beer_study.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Model
class BeerRating(db.Model):
    __tablename__ = 'beer_ratings'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), nullable=False)  # UUID to track which user submitted the rating
    beer_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    
    # Demographics
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    # Taste preferences (0-10 scale for most, special handling for frequency and alcohol)
    dark_white_chocolate = db.Column(db.Integer, nullable=False)  # Dark Chocolate (1) ↔ White Chocolate (10)
    curry_cucumber = db.Column(db.Integer, nullable=False)  # Curry (1) ↔ Cucumber salad (10)
    vanilla_lemon = db.Column(db.Integer, nullable=False)  # Vanilla ice cream (1) ↔ Lemon sorbet (10)
    caramel_wasabi = db.Column(db.Integer, nullable=False)  # Caramel popcorn (1) ↔ Wasabi peas (10)
    blue_mozzarella = db.Column(db.Integer, nullable=False)  # Blue cheese (1) ↔ Fresh mozzarella (10)
    sparkling_sweet = db.Column(db.Integer, nullable=False)  # Sparkling water (1) ↔ Sweet soda (10)
    barbecue_ketchup = db.Column(db.Integer, nullable=False)  # Barbecue sauce (1) ↔ Tomato ketchup (10)
    tropical_winter = db.Column(db.Integer, nullable=False)  # Tropical paradise (1) ↔ Winter wonderland (10)
    early_night = db.Column(db.Integer, nullable=False)  # Early bird (1) ↔ Night out (10)
    beer_frequency = db.Column(db.String(20), nullable=False)  # 'never', 'rarely', 'often', 'very_often'
    drinks_alcohol = db.Column(db.Boolean, nullable=False)  # true = drinks alcohol, false = doesn't
    
    submitted_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

def enable_wal_mode():
    """Enable WAL mode for better concurrency"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.execute('PRAGMA journal_mode=WAL;')
    conn.close()

@app.route('/submit_rating', methods=['POST'])
def submit_rating():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'user_id', 'beer_name', 'rating', 'age', 'gender', 'latitude', 'longitude',
            'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon', 'caramel_wasabi',
            'blue_mozzarella', 'sparkling_sweet', 'barbecue_ketchup',
            'tropical_winter', 'early_night', 'beer_frequency', 'drinks_alcohol'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate rating range
        if not (1 <= data['rating'] <= 10):
            return jsonify({'error': 'Rating must be between 1 and 10'}), 400
        
        # Validate preference ranges
        preference_fields = [
            'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon', 'caramel_wasabi',
            'blue_mozzarella', 'sparkling_sweet', 'barbecue_ketchup',
            'tropical_winter', 'early_night'
        ]
        
        for field in preference_fields:
            if not (0 <= data[field] <= 10):
                return jsonify({'error': f'{field} must be between 0 and 10'}), 400
        
        # Validate beer frequency
        valid_frequencies = ['never', 'once_a_month', 'once_a_week', 'multiple_times_a_week']
        if data['beer_frequency'] not in valid_frequencies:
            return jsonify({'error': 'Invalid beer_frequency value'}), 400
        
        # Validate drinks_alcohol (boolean)
        if not isinstance(data['drinks_alcohol'], bool):
            return jsonify({'error': 'drinks_alcohol must be a boolean'}), 400
        
        # Create new beer rating record
        rating_record = BeerRating(
            user_id=data['user_id'],
            beer_name=data['beer_name'],
            rating=data['rating'],
            age=data['age'],
            gender=data['gender'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            dark_white_chocolate=data['dark_white_chocolate'],
            curry_cucumber=data['curry_cucumber'],
            vanilla_lemon=data['vanilla_lemon'],
            caramel_wasabi=data['caramel_wasabi'],
            blue_mozzarella=data['blue_mozzarella'],
            sparkling_sweet=data['sparkling_sweet'],
            barbecue_ketchup=data['barbecue_ketchup'],
            tropical_winter=data['tropical_winter'],
            early_night=data['early_night'],
            beer_frequency=data['beer_frequency'],
            drinks_alcohol=data['drinks_alcohol']
        )
        
        db.session.add(rating_record)
        db.session.commit()
        
        return jsonify({
            'status': 'ok',
            'id': rating_record.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get basic statistics about collected data"""
    try:
        total_ratings = BeerRating.query.count()
        unique_users = db.session.query(
            BeerRating.latitude,
            BeerRating.longitude,
            BeerRating.age,
            BeerRating.gender
        ).distinct().count()
        
        return jsonify({
            'total_ratings': total_ratings,
            'estimated_users': unique_users
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict_beer():
    """Predict beer preferences based on user profile"""
    print("=== PREDICTION ENDPOINT CALLED ===")
    try:
        data = request.get_json()
        print(f"Received prediction request with data: {data}")
        
        # Validate required fields
        required_fields = [
            'age', 'gender', 'latitude', 'longitude',
            'dark_white_chocolate', 'curry_cucumber', 'vanilla_lemon',
            'caramel_wasabi', 'blue_mozzarella', 'sparkling_sweet',
            'barbecue_ketchup', 'tropical_winter', 'early_night'
        ]
        
        for field in required_fields:
            if field not in data:
                error_msg = f'Missing required field: {field}'
                print(f"Validation error: {error_msg}")
                return jsonify({'error': error_msg}), 400
        
        print("All required fields present, calling predictor...")
        
        # Get predictor instance based on configuration
        predictor = get_configured_predictor()
        
        # Make prediction
        result = predictor.predict(data)
        print(f"Prediction result: {result}")
        
        return jsonify(result), 200 if result.get('success') else 400
        
    except Exception as e:
        error_msg = f'Prediction failed: {str(e)}'
        print(f"Exception in prediction: {error_msg}")
        return jsonify({
            'success': False,
            'error': error_msg,
            'recommended_beer': None,
            'confidence': 0.0,
            'similar_users_count': 0
        }), 500

if __name__ == '__main__':
    # Print configuration info
    print("🍺 Beer Study Application Starting...")
    print("=" * 50)
    print(f"📊 Predictor Type: {PREDICTOR_TYPE}")
    if PREDICTOR_TYPE.lower() == 'llm':
        api_key_status = "✅ Set" if OPENAI_API_KEY else "❌ Not Set"
        print(f"🔑 OpenAI API Key: {api_key_status}")
        print(f"🤖 OpenAI Model: {OPENAI_MODEL}")
    print("=" * 50)
    
    # Test predictor configuration
    try:
        test_predictor = get_configured_predictor()
        print("✅ Predictor initialized successfully")
    except Exception as e:
        print(f"❌ Predictor initialization failed: {e}")
    
    print()  # Empty line for readability
    
    # Create database tables and enable WAL mode
    with app.app_context():
        db.create_all()
        enable_wal_mode()
    
    # Run in development mode
    app.run(host='0.0.0.0', port=5000, debug=True)
