# FitAI - Adaptive Fitness Intelligence Platform

A full-stack AI-powered fitness platform that generates personalized, adaptive workout and diet plans, tracks progress, and provides intelligent coaching.

## 🌟 Features

- **Personalized Workout Plans** - Generates dynamic 7-day plans based on experience level, goals, and fatigue status
- **Smart Diet Planning** - Macro-optimized meal plans with calorie targets
- **Progress Tracking** - Weight, measurements, adherence metrics with visualizations
- **Habit Intelligence** - Calculates weekly habit scores and streaks
- **Drop-off Risk Detection** - Identifies when users are at risk of dropping off
- **AI Fitness Coach** - Rule-based chatbot providing data-driven fitness advice
- **Energy & Recovery** - Tracks fatigue levels and forces recovery when needed
- **Progressive Overload** - Automatically adjusts workout intensity based on performance
- **Goal Forecasting** - Estimates timeline to goal achievement

## 📋 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 18** with Hooks
- **Vite** for bundling
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Recharts** for data visualization

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitai
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the backend server:
```bash
npm run dev  # With nodemon
npm start   # Without nodemon
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get authenticated user profile

### Profile
- `POST /api/profile` - Create health profile
- `GET /api/profile` - Get user's profile
- `PUT /api/profile` - Update profile

### Workouts
- `POST /api/workouts` - Generate workout plan
- `GET /api/workouts/latest` - Get latest workout plan
- `GET /api/workouts/week/:week_number` - Get workout by week
- `GET /api/workouts` - Get all workout plans

### Diet
- `POST /api/diet` - Generate diet plan
- `GET /api/diet/latest` - Get latest diet plan
- `GET /api/diet/week/:week_number` - Get diet by week
- `GET /api/diet` - Get all diet plans

### Progress & Tracking
- `POST /api/progress` - Log weekly progress
- `GET /api/progress` - Get all progress logs
- `GET /api/progress/recent?weeks=12` - Get recent progress
- `POST /api/progress/energy` - Log energy level
- `GET /api/progress/energy/recent?days=7` - Get energy logs
- `POST /api/progress/measurements` - Log body measurements
- `GET /api/progress/measurements` - Get all measurements
- `GET /api/progress/habits` - Get habit scores
- `GET /api/progress/habits/current` - Get current habit score
- `GET /api/progress/dropoff/check` - Check drop-off risk
- `GET /api/progress/forecast/goal` - Forecast goal achievement

### AI Coach
- `POST /api/assistant/ask` - Ask fitness coach a question

## 📊 Database Models

### User
- name, email, password_hash, created_at, updated_at

### Profile
- user_id, age, biological_sex, height_cm, weight_kg, activity_level
- experience_level, goal, target_weight_kg
- calculated: bmi, bmr, daily_calorie_target

### WorkoutPlan
- user_id, week_number, goal, experience_level, fatigue_status
- workouts: [day, type, exercises, rest_day]

### DietPlan
- user_id, week_number, daily_calorie_target, goal
- macros: protein/carbs/fat (grams and %)
- meals: [meal_number, name, description, calories, macros]

### ProgressLog
- user_id, week_number, weight_kg, daily_logs
- workout_adherence_percent, diet_adherence_percent

### HabitScore
- user_id, week_number, workout_adherence, diet_adherence
- habit_score, streak_count, monthly_average

### EnergyLog
- user_id, date, energy_level, notes

### BodyMeasurement
- user_id, date, measurements (waist, chest, hips, arms, thighs), notes

## 🧮 Key Calculations

### BMI
```
BMI = weight_kg / (height_m)^2
```

### BMR (Mifflin-St Jeor)
```
Men: (10 × weight) + (6.25 × height) − (5 × age) + 5
Women: (10 × weight) + (6.25 × height) − (5 × age) − 161
```

### TDEE
```
TDEE = BMR × Activity Factor
```

### Daily Calorie Target
```
Weight Loss: TDEE - 400 kcal
Muscle Gain: TDEE + 300 kcal
Maintenance: TDEE
```

### Habit Score
```
Habit Score = (Workout Adherence × 0.60) + (Diet Adherence × 0.40)
```

### Macro Distribution
```
Weight Loss: 40% Protein, 30% Carbs, 30% Fat
Muscle Gain: 30% Protein, 50% Carbs, 20% Fat
```

## 🎯 Workflow

1. **Register & Profile Setup** → User creates account and enters health metrics
2. **Generate Plans** → System generates personalized workout and diet plans
3. **Execute & Log** → User completes workouts and logs diet adherence
4. **Track & Analyze** → System tracks progress, calculates metrics
5. **Detect Risks** → System identifies drop-off risk patterns
6. **Adapt & Coach** → Plans adjust, AI coach provides guidance
7. **Repeat** → Next week's plans generated based on feedback loop

## 🔐 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 30-day expiration
- Protected routes require valid authentication
- CORS configured for frontend domain
- Environment variables for sensitive data

## 📝 Example API Usage

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'
```

### Create Profile
```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "age":30,
    "biological_sex":"Male",
    "height_cm":180,
    "weight_kg":85,
    "activity_level":"Moderate",
    "experience_level":"Intermediate",
    "goal":"Weight Loss",
    "target_weight_kg":75
  }'
```

### Generate Workout
```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"week_number":1}'
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy with `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy dist folder
3. Set API URL to production backend

## 📈 Future Enhancements

- OpenAI integration for advanced AI coaching
- Video exercise tutorials
- Social features (friend challenges)
- Mobile app (React Native)
- Wearable integration (Apple Health, Fitbit)
- Advanced analytics dashboard
- Community workouts library
- Admin panel for user management

## 📄 License

MIT License

## 👨‍💻 Author

FitAI Development Team
