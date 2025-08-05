# Beer Preference Study Application

A full-stack web application for conducting beer preference studies with real-time data collection and analysis.

## 🚀 Quick Start

### 1. Configure Network Settings (One-Time Setup)
```bash
# Automatically detect and configure your IP address
./configure-ip.sh detect
```

### 2. Start the Application
```bash
# Terminal 1: Start the backend
cd backend
./start.sh

# Terminal 2: Start the frontend  
./start-frontend.sh
```

### 3. Access the Application
- **Frontend**: http://YOUR_IP:3000
- **Backend API**: http://YOUR_IP:5000

## ⚙️ Configuration

All network configuration is centralized in `config.env`. You only need to update the IP address in one place:

```bash
# config.env
IP_ADDRESS=10.100.91.169  # <- Change this to your IP address
BACKEND_PORT=5000
FRONTEND_PORT=3000
```

The scripts automatically generate the necessary environment files from this central configuration.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, TailwindCSS (`beer-ml-frontend/`)
- **Backend**: Flask with Gunicorn, SQLAlchemy ORM (`backend/`)
- **Database**: SQLite with WAL mode for concurrency
- **Map Integration**: Leaflet.js for location selection
- **State Management**: Zustand for React state

## 📁 Project Structure

```
Beer-ML/
├── backend/                    # Flask backend application
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── start.sh              # Backend startup script
│   └── venv/                 # Python virtual environment
├── beer-ml-frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── profile/      # Profile setup page
│   │   │   ├── preferences/  # Taste preferences page
│   │   │   ├── dashboard/    # Beer selection dashboard
│   │   │   ├── beer_[id]/    # Individual beer rating pages
│   │   │   └── complete/     # Completion page
│   │   ├── components/       # React components
│   │   ├── lib/             # Utilities and configurations
│   │   └── store/           # State management
│   ├── .env.local           # Environment variables (gitignored)
│   └── package.json         # Node.js dependencies
├── .github/
│   └── copilot-instructions.md  # GitHub Copilot instructions
├── .env.example             # Environment template
├── .env.local.example       # Frontend environment template
├── start-frontend.sh        # Frontend startup script
├── PROJECT_OVERVIEW.md      # Detailed project overview
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- npm or yarn (for frontend dependencies)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Beer-ML
   ```

2. **Set up environment variables:**
   ```bash
   # Copy example files and customize
   cp .env.example .env.local
   cp .env.local.example beer-ml-frontend/.env.local
   # Edit the files to match your network configuration
   ```

3. **Start the backend:**
   ```bash
   cd backend
   ./start.sh
   ```
   The backend will be available at `http://localhost:5000`

4. **Start the frontend (in a new terminal):**
   ```bash
   cd Beer-ML  # back to root directory
   ./start-frontend.sh
   ```
   The frontend will be available at `http://localhost:3000`

### Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py  # For development
# OR for production:
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Frontend Setup
```bash
cd beer-ml-frontend
npm install
npm run build
npm start -- --hostname 0.0.0.0 --port 3000
```

## 📱 User Flow

### Frontend (Next.js)
- Use App Router with TypeScript
- Implement pages for: `/profile`, `/preferences`, `/dashboard`, `/beer_[id]`, `/complete`
- Use React Context or Zustand for state management
- Include map picker using Leaflet.js for location selection
- Send complete JSON payload with each beer rating
- Individual beer pages allow flexible rating order

## 🛠️ Technical Details

### Database Schema

The `BeerRating` table stores each beer rating as a separate row:

```sql
CREATE TABLE beer_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beer_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    white_dark INTEGER NOT NULL,
    curry_soup INTEGER NOT NULL,
    lemon_vanilla INTEGER NOT NULL,
    salmon_chicken INTEGER NOT NULL,
    cucumber_pumpkin INTEGER NOT NULL,
    espresso_latte INTEGER NOT NULL,
    chili_risotto INTEGER NOT NULL,
    grapefruit_banana INTEGER NOT NULL,
    cheese_mozzarella INTEGER NOT NULL,
    almonds_honey INTEGER NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

#### `POST /submit_rating`
Accepts a complete beer rating with user profile and preferences.

**Request Body:**
```json
{
  "beer_name": "Pale Ale",
  "rating": 8,
  "age": 27,
  "gender": "female",
  "latitude": 52.5200,
  "longitude": 13.4050,
  "white_dark": 7,
  "curry_soup": 3,
  "lemon_vanilla": 5,
  "salmon_chicken": 2,
  "cucumber_pumpkin": 8,
  "espresso_latte": 6,
  "chili_risotto": 4,
  "grapefruit_banana": 7,
  "cheese_mozzarella": 1,
  "almonds_honey": 9
}
```

**Response:**
```json
{
  "status": "ok",
  "id": 123
}
```

#### `GET /health`
Health check endpoint.

#### `GET /stats`
Returns basic statistics about collected data.

### Taste Preference Questions

1. **White chocolate ↔ Dark chocolate**
2. **Curry ↔ Potato soup**
3. **Lemon sorbet ↔ Vanilla ice cream**
4. **Smoked salmon ↔ Grilled chicken**
5. **Pickled cucumbers ↔ Roasted pumpkin**
6. **Espresso ↔ Café latte**
7. **Chili con carne ↔ Mushroom risotto**
8. **Grapefruit ↔ Banana**
9. **Blue cheese ↔ Fresh mozzarella**
10. **Salted almonds ↔ Honey-glazed nuts**

### Beer Types

1. Pale Ale
2. IPA (India Pale Ale)
3. Lager
4. Pilsner
5. Wheat Beer
6. Stout
7. Porter
8. Belgian Blonde
9. Saison
10. Amber Ale

## 🌐 Deployment

### Local Network Deployment

1. **Find your laptop's IP address:**
   ```bash
   # Linux/Mac
   ip addr show | grep inet
   # or
   ifconfig | grep inet
   ```

2. **Update environment variables:**
   - Frontend: Update `NEXT_PUBLIC_API_URL` in `.env.local`
   - Backend: No changes needed (binds to 0.0.0.0)

3. **Start both services:**
   ```bash
   # Terminal 1 - Backend
   cd backend && ./start.sh
   
   # Terminal 2 - Frontend
   ./start-frontend.sh
   ```

4. **Access from other devices:**
   - Frontend: `http://<your-ip>:3000`
   - Backend API: `http://<your-ip>:5000`

### Production Considerations

- **Concurrency**: Configured for ~20 concurrent users with 4 Gunicorn workers
- **Database**: SQLite with WAL mode enables concurrent reads/writes
- **Security**: Add HTTPS, rate limiting, and input sanitization for production
- **Monitoring**: Consider adding logging and error tracking

## 📊 Data Analysis

The SQLite database can be analyzed directly with SQL queries:

```sql
-- Total users and ratings
SELECT COUNT(DISTINCT age, gender, latitude, longitude) as unique_users,
       COUNT(*) as total_ratings
FROM beer_ratings;

-- Average ratings by beer type
SELECT beer_name, AVG(rating) as avg_rating, COUNT(*) as rating_count
FROM beer_ratings
GROUP BY beer_name
ORDER BY avg_rating DESC;

-- Age distribution
SELECT 
  CASE 
    WHEN age < 25 THEN '18-24'
    WHEN age < 35 THEN '25-34'
    WHEN age < 45 THEN '35-44'
    WHEN age < 55 THEN '45-54'
    ELSE '55+'
  END as age_group,
  COUNT(*) as count
FROM beer_ratings
GROUP BY age_group;
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill processes on specific ports
   lsof -ti:3000 | xargs kill -9  # Frontend
   lsof -ti:5000 | xargs kill -9  # Backend
   ```

2. **Database locked errors:**
   - Ensure WAL mode is enabled
   - Check file permissions on `backend/beer_study.db`

3. **Map not loading:**
   - Check network connectivity
   - Verify Leaflet CSS is loaded

4. **API connection issues:**
   - Verify backend is running on port 5000
   - Check `NEXT_PUBLIC_API_URL` in frontend environment

### Development Tips

- **Hot reload**: Use `npm run dev` instead of `npm start` for frontend development
- **Backend debugging**: Set `debug=True` in `app.py` for development
- **Database inspection**: Use SQLite browser tools to inspect data

## 📄 License

This project is created for research purposes. Please ensure compliance with data protection regulations when collecting user data.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical issues or questions, please create an issue in the project repository.
