from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
import sqlite3

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    # Create database tables and enable WAL mode
    with app.app_context():
        db.create_all()
        enable_wal_mode()
    
    # Run in development mode
    app.run(host='0.0.0.0', port=5000, debug=True)
