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
    beer_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    
    # Demographics
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    # Taste preferences (0-10 scale)
    white_dark = db.Column(db.Integer, nullable=False)  # White chocolate ↔ Dark chocolate
    curry_soup = db.Column(db.Integer, nullable=False)  # Curry ↔ Potato soup
    lemon_vanilla = db.Column(db.Integer, nullable=False)  # Lemon sorbet ↔ Vanilla ice cream
    salmon_chicken = db.Column(db.Integer, nullable=False)  # Smoked salmon ↔ Grilled chicken
    cucumber_pumpkin = db.Column(db.Integer, nullable=False)  # Pickled cucumbers ↔ Roasted pumpkin
    espresso_latte = db.Column(db.Integer, nullable=False)  # Espresso ↔ Café latte
    chili_risotto = db.Column(db.Integer, nullable=False)  # Chili con carne ↔ Mushroom risotto
    grapefruit_banana = db.Column(db.Integer, nullable=False)  # Grapefruit ↔ Banana
    cheese_mozzarella = db.Column(db.Integer, nullable=False)  # Blue cheese ↔ Fresh mozzarella
    almonds_honey = db.Column(db.Integer, nullable=False)  # Salted almonds ↔ Honey-glazed nuts
    
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
            'beer_name', 'rating', 'age', 'gender', 'latitude', 'longitude',
            'white_dark', 'curry_soup', 'lemon_vanilla', 'salmon_chicken',
            'cucumber_pumpkin', 'espresso_latte', 'chili_risotto',
            'grapefruit_banana', 'cheese_mozzarella', 'almonds_honey'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate rating range
        if not (1 <= data['rating'] <= 10):
            return jsonify({'error': 'Rating must be between 1 and 10'}), 400
        
        # Validate preference ranges
        preference_fields = [
            'white_dark', 'curry_soup', 'lemon_vanilla', 'salmon_chicken',
            'cucumber_pumpkin', 'espresso_latte', 'chili_risotto',
            'grapefruit_banana', 'cheese_mozzarella', 'almonds_honey'
        ]
        
        for field in preference_fields:
            if not (0 <= data[field] <= 10):
                return jsonify({'error': f'{field} must be between 0 and 10'}), 400
        
        # Create new beer rating record
        rating_record = BeerRating(
            beer_name=data['beer_name'],
            rating=data['rating'],
            age=data['age'],
            gender=data['gender'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            white_dark=data['white_dark'],
            curry_soup=data['curry_soup'],
            lemon_vanilla=data['lemon_vanilla'],
            salmon_chicken=data['salmon_chicken'],
            cucumber_pumpkin=data['cucumber_pumpkin'],
            espresso_latte=data['espresso_latte'],
            chili_risotto=data['chili_risotto'],
            grapefruit_banana=data['grapefruit_banana'],
            cheese_mozzarella=data['cheese_mozzarella'],
            almonds_honey=data['almonds_honey']
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
