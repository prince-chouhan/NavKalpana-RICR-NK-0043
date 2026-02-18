# FitAI Setup Guide

## Quick Start

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your settings
# - Set MONGODB_URI (local or Atlas)
# - Keep or change JWT_SECRET

# Start backend (requires MongoDB running)
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup (5 minutes)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux: Follow MongoDB official docs
# Windows: Download from mongodb.com
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update MONGODB_URI in .env

## Project Structure

```
FitAI/
├── backend/
│   ├── models/          # Database schemas
│   ├── controllers/     # Route handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Auth, validation
│   ├── utils/           # Helper functions
│   ├── server.js        # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── services/    # API calls
│   │   ├── utils/       # Helpers
│   │   ├── App.js       # Main component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── docs/
    └── API_ENDPOINTS.md
```

## Testing the Application

### 1. Register a User
```
Go to: http://localhost:3000/register
Fill in: Name, Email, Password
Click: Register
```

### 2. Complete Profile Setup
```
Fill in all profile fields:
- Age
- Biological Sex
- Height (cm)
- Weight (kg)
- Activity Level
- Experience Level
- Goal
- Target Weight (kg)
Click: Complete Setup
```

### 3. View Dashboard
```
See:
- Habit Score
- Risk Status
- Weight Progress
- Quick Links
```

### 4. Generate Plans
```
- Click "View Workout Plan" - See 7-day workout
- Click "View Diet Plan" - See macro targets and meals
```

### 5. Test AI Coach
```
Go to: /assistant
Ask questions like:
- "Why am I not losing weight?"
- "Should I increase protein?"
- "Can I skip cardio?"
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitai
JWT_SECRET=change_this_to_a_secure_random_string
NODE_ENV=development
```

### Frontend (.env.local - optional)
```
VITE_API_URL=http://localhost:5000/api
```

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Start MongoDB
- macOS: brew services start mongodb-community
- Linux: sudo systemctl start mongod
```

### Port Already in Use
```
Backend (5000): 
  lsof -ti:5000 | xargs kill -9
  OR change PORT in .env

Frontend (3000):
  lsof -ti:3000 | xargs kill -9
```

### CORS Error
```
Error: Cross-Origin Request Blocked
Solution: Check vite.config.js proxy configuration
         Ensure backend CORS middleware is enabled
```

### JWT Token Error
```
Error: Invalid or expired token
Solution: 
- Log out and log in again
- Check JWT_SECRET matches between sessions
- Tokens expire in 30 days
```

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
# Copy the token from response
```

### Create Profile (with token)
```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "age":30,
    "biological_sex":"Male",
    "height_cm":180,
    "weight_kg":85,
    "activity_level":"Moderate",
    "experience_level":"Beginner",
    "goal":"Weight Loss",
    "target_weight_kg":75
  }'
```

### Generate Workout Plan
```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"week_number":1}'
```

## Development Tips

### Hot Reload
- **Backend**: Runs with nodemon (auto-restart on file change)
- **Frontend**: Vite provides instant HMR

### Debug Backend
```bash
# Add console.logs in code
# Run: npm run dev
# Check terminal for output
```

### Debug Frontend
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for API calls

### Database Inspection
```bash
# Using MongoDB CLI
mongosh

# Show databases
show dbs

# Use fitai database
use fitai

# Show collections
show collections

# Query users
db.users.find()
```

## Building for Production

### Backend
```bash
cd backend
npm start  # Make sure .env has production values
```

### Frontend
```bash
cd frontend
npm run build  # Creates dist/ folder
npm run preview  # Test production build locally
```

## Next Steps

1. **Add more features**:
   - Email notifications
   - Social sharing
   - Advanced analytics
   - Mobile app

2. **Optimize**:
   - Add caching
   - Optimize database queries
   - Code splitting

3. **Deploy**:
   - Backend to Heroku/Railway/Render
   - Frontend to Vercel/Netlify
   - Database to MongoDB Atlas

## Support

For issues or questions, check:
- Backend logs: npm terminal
- Frontend logs: Browser console
- API responses: Network tab in DevTools
