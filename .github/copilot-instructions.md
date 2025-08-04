<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Beer Preference Study Application

This is a full-stack web application for conducting beer preference studies with the following stack:

- **Frontend**: Next.js 14 with App Router, TypeScript, and TailwindCSS
- **Backend**: Flask with Gunicorn and SQLAlchemy ORM
- **Database**: SQLite with WAL mode for concurrency
- **Target**: Local deployment for ~100 users with up to 20 concurrent submissions

## Architecture Guidelines

### Frontend (Next.js)
- Use App Router with TypeScript
- Implement pages for: `/profile`, `/preferences`, `/rate`
- Use React Context or Zustand for state management
- Include map picker using Leaflet.js for location selection
- Send complete JSON payload with each beer rating

### Backend (Flask)
- Use SQLAlchemy ORM with SQLite
- Enable WAL mode for concurrency
- Single endpoint: `POST /submit_rating`
- Run with Gunicorn (4 workers) for production

### Database Schema
- Table: `BeerRating` with all demographic, preference, and rating data
- Each beer rating = separate row (users × 10 beers = total rows)

### API Format
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

When working on this project, focus on concurrency safety, responsive design, and clear user flow through the three main phases of data collection.
