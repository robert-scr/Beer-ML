# Beer Preference Study - Project Overview

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
│   │   │   ├── rate/         # Beer rating page
│   │   │   └── complete/     # Completion page
│   │   ├── components/       # React components
│   │   │   └── LocationPicker.tsx  # Map-based location picker
│   │   ├── lib/             # Utilities and configurations
│   │   │   ├── api.ts       # API service functions
│   │   │   └── constants.ts # Beer and preference configurations
│   │   └── store/           # State management
│   │       └── beerRatingStore.ts  # Zustand store
│   ├── .env.local           # Environment variables
│   └── package.json         # Node.js dependencies
├── .github/
│   └── copilot-instructions.md  # GitHub Copilot instructions
├── .env.example             # Environment template
├── start-frontend.sh        # Frontend startup script
└── README.md               # Complete documentation
```

## 🎯 Key Features Implemented

### Frontend (Next.js + TypeScript + TailwindCSS)
- ✅ **Home Page**: Welcome screen with study overview
- ✅ **Profile Setup**: Age, gender, and interactive map location selection
- ✅ **Taste Preferences**: 10 slider-based preference questions
- ✅ **Beer Rating**: Sequential rating of 10 beer types with progress tracking
- ✅ **Completion Page**: Thank you screen with statistics
- ✅ **State Management**: Zustand store for user data persistence
- ✅ **Map Integration**: Leaflet.js for coordinate selection
- ✅ **Responsive Design**: Mobile and desktop optimized

### Backend (Flask + SQLAlchemy + SQLite)
- ✅ **REST API**: Single endpoint for beer rating submission
- ✅ **Database Schema**: Complete schema with all required fields
- ✅ **Concurrency Support**: SQLite WAL mode for concurrent access
- ✅ **Data Validation**: Input validation and error handling
- ✅ **CORS Support**: Cross-origin requests enabled
- ✅ **Production Ready**: Gunicorn with 4 workers

### Database Design
- ✅ **Single Table Approach**: Each beer rating as separate row
- ✅ **Complete Data Model**: Demographics + preferences + rating
- ✅ **Timestamp Tracking**: Automatic submission timestamps
- ✅ **Concurrent Access**: WAL mode for ~20 simultaneous users

## 🚀 Quick Start Commands

### Start Backend (Terminal 1)
```bash
cd backend
./start.sh
```

### Start Frontend (Terminal 2)
```bash
./start-frontend.sh
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **Statistics**: http://localhost:5000/stats

## 🌐 Network Deployment

For local network access (multiple users on same WiFi):

1. **Find your IP address**:
   ```bash
   ip addr show | grep inet
   ```

2. **Update frontend environment**:
   ```bash
   # Edit beer-ml-frontend/.env.local
   NEXT_PUBLIC_API_URL=http://YOUR_IP:5000
   ```

3. **Rebuild frontend**:
   ```bash
   cd beer-ml-frontend
   npm run build
   ```

4. **Start both services**:
   ```bash
   cd backend && ./start.sh     # Terminal 1
   ./start-frontend.sh          # Terminal 2
   ```

5. **Share with users**:
   - Frontend: `http://YOUR_IP:3000`

## 📊 Data Collection

Each beer rating creates a database row with:
- **Beer information**: Name and rating (1-10)
- **Demographics**: Age, gender, location coordinates
- **Taste preferences**: 10 preference values (0-10)
- **Metadata**: Submission timestamp

**Final dataset**: Users × 10 beers = Total rows

## ✅ Production Checklist

- [x] Frontend built and optimized
- [x] Backend with production server (Gunicorn)
- [x] Database with concurrency support
- [x] Input validation and error handling
- [x] CORS configured for cross-origin requests
- [x] Responsive design for mobile/desktop
- [x] Map integration for location selection
- [x] Progress tracking and user feedback
- [x] Complete documentation

## 🔧 Development vs Production

### Development Mode
```bash
# Backend
cd backend && venv/bin/python app.py

# Frontend  
cd beer-ml-frontend && npm run dev
```

### Production Mode
```bash
# Backend (4 Gunicorn workers)
cd backend && ./start.sh

# Frontend (optimized build)
./start-frontend.sh
```

The application is now ready for deployment and can handle the specified requirements of ~100 users with up to 20 concurrent submissions.
