# FitAI - Quick Reference Guide

## 🚀 Start Here

### 1. Install & Run (2 minutes)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 3 - MongoDB:**
```bash
mongod
```

Then open: http://localhost:3000

### 2. Test the App (5 minutes)

1. Click **Sign Up** on landing page
2. Enter: name, email, password
3. Fill profile form (all fields required)
4. Click **Complete Setup**
5. See **Dashboard** with your metrics
6. Click links to explore features

## 📁 Project Structure

```
FitAI/
├── backend/              # Node.js + Express
│   ├── models/          # 8 Database models
│   ├── controllers/      # Route handlers
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── middleware/      # Auth
│   ├── utils/           # Calculations & generators
│   └── server.js        # Start here
│
├── frontend/            # React + Vite
│   ├── src/pages/       # 9 Full pages
│   ├── src/context/     # Auth state
│   ├── src/services/    # API calls
│   └── src/App.js       # Router
│
└── docs/                # Documentation
    └── API_ENDPOINTS.md # Complete API reference
```

## 🎯 Key Features

### ✅ Authentication
- Register with email
- Login with password
- JWT tokens (30-day expiration)
- Bcrypt password hashing

### ✅ Profile Setup
- Height, weight, age, sex
- Activity level, experience
- Fitness goal & target weight
- **Auto-calculates**: BMI, BMR, daily calorie target

### ✅ Workout Plans
- Beginner, Intermediate, Advanced levels
- 7-day customized plans
- Each exercise has: sets, reps, rest time, intensity
- Adapts to fatigue levels

### ✅ Diet Plans
- Calorie target based on goal
- Macro-optimized splits (P/C/F)
- 4-5 daily meals with breakdowns
- Protein-heavy for weight loss

### ✅ Progress Tracking
- Log weekly: weight, workout completion, diet adherence
- **Habit Score** = (Workout×0.60) + (Diet×0.40)
- Track streaks (consistent weeks)
- Body measurements (waist, chest, hips, arms, thighs)

### ✅ Smart Analysis
- **Drop-off Risk**: Detects 3 missed workouts or low adherence
- **Goal Forecast**: Estimates weeks to reach target weight
- **Energy Logs**: Tracks fatigue for recovery management
- **Progressive Overload**: Auto-increases intensity if consistent

### ✅ AI Coach
- Rule-based (no external API)
- Uses your real data to answer:
  - "Why am I not losing weight?"
  - "Should I increase protein?"
  - "Can I skip cardio?"
  - "How do I reduce fatigue?"

### ✅ Visualizations
- Weight trend graph
- Adherence bar chart
- Habit score line chart
- All charts interactive (Recharts)

## 🔗 Important Endpoints

### Quick Test URLs

```
Landing:      http://localhost:3000
Dashboard:    http://localhost:3000/dashboard
Workouts:     http://localhost:3000/workouts
Diet:         http://localhost:3000/diet
Progress:     http://localhost:3000/progress
AI Coach:     http://localhost:3000/assistant
API Health:   http://localhost:5000/health
```

### Backend API Examples

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

**Create Profile** (need token from login)
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
    "experience_level":"Beginner",
    "goal":"Weight Loss",
    "target_weight_kg":75
  }'
```

**Generate Workout**
```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Database Models (MongoDB)

```javascript
// User
{
  name, email, password_hash, created_at
}

// Profile
{
  user_id, age, biological_sex, height_cm, weight_kg,
  activity_level, experience_level, goal, target_weight_kg,
  bmi, bmr, daily_calorie_target
}

// WorkoutPlan
{
  user_id, week_number, goal, experience_level,
  workouts: [
    { day, day_name, type, exercises: [{name, sets, reps, rest_seconds, guidance}], rest_day }
  ]
}

// DietPlan
{
  user_id, week_number, daily_calorie_target, goal,
  protein_grams, carbs_grams, fat_grams,
  meals: [{meal_number, name, description, calories, macros}]
}

// ProgressLog
{
  user_id, week_number, weight_kg,
  daily_logs: [{day_number, date, workout_completion, diet_adherence}],
  workout_adherence_percent, diet_adherence_percent
}

// HabitScore
{
  user_id, week_number, workout_adherence_percent, diet_adherence_percent,
  habit_score, streak_count, monthly_average
}

// EnergyLog
{
  user_id, date, energy_level, notes
}

// BodyMeasurement
{
  user_id, date,
  measurements: {waist_cm, chest_cm, hips_cm, left_arm_cm, right_arm_cm, left_thigh_cm, right_thigh_cm}
}
```

## 🧮 Important Calculations

### BMI
`weight_kg / (height_cm/100)²`

### BMR (Mifflin-St Jeor)
- **Male**: (10×weight) + (6.25×height) − (5×age) + 5
- **Female**: (10×weight) + (6.25×height) − (5×age) − 161

### Daily Calorie Target
- **Weight Loss**: BMR × Activity Factor − 400
- **Muscle Gain**: BMR × Activity Factor + 300
- **Maintenance**: BMR × Activity Factor
- **Min Safety**: Women 1200, Men 1500

### Macros
- **Weight Loss**: 40% Protein, 30% Carbs, 30% Fat
- **Muscle Gain**: 30% Protein, 50% Carbs, 20% Fat

### Habit Score
`(Workout Adherence × 0.60) + (Diet Adherence × 0.40)` → 0-100

## ⚙️ Environment Setup

### Backend .env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitai
JWT_SECRET=your_secret_key_change_in_production
NODE_ENV=development
```

### Frontend .env.local (optional)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔐 Security Features

✅ Bcrypt password hashing (10 salt rounds)
✅ JWT token authentication (30-day expiration)
✅ Protected routes (middleware validation)
✅ CORS configuration
✅ Environment variables for secrets
✅ No hardcoded credentials
✅ Password not returned in API responses

## 📦 Dependencies Summary

### Backend
- express (web framework)
- mongoose (MongoDB)
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- cors (cross-origin)
- dotenv (environment)

### Frontend
- react (UI library)
- axios (HTTP client)
- recharts (charts)
- tailwindcss (styling)
- react-router-dom (routing - add if needed)

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Solution**: Make sure mongod is running
```bash
mongod  # Local
# OR use MongoDB Atlas connection string in .env
```

### Issue: Port Already in Use
**Solution**: Kill the process
```bash
# Backend (5000):
lsof -ti:5000 | xargs kill -9

# Frontend (3000):
lsof -ti:3000 | xargs kill -9
```

### Issue: CORS Error
**Solution**: Check backend server.js has CORS enabled

### Issue: JWT Token Invalid
**Solution**: Log out and log back in

## 📚 File Locations

### Key Backend Files
- Server setup: `backend/server.js`
- Auth logic: `backend/services/authService.js`
- Calculations: `backend/utils/calculationUtils.js`
- Workout gen: `backend/utils/workoutGenerator.js`
- AI logic: `backend/services/assistantService.js`

### Key Frontend Files
- Router: `frontend/src/App.js`
- Auth state: `frontend/src/context/AuthContext.js`
- API calls: `frontend/src/services/apiService.js`
- Pages: `frontend/src/pages/*.js`

## 🎓 Code Examples

### Accessing User Data in Frontend
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, token, login, logout } = useAuth();
  
  return <p>Hello {user?.name}</p>;
}
```

### Making API Calls
```javascript
import { workoutService } from '../services/apiService';

const workout = await workoutService.getLatestWorkout();
```

### Backend Service Pattern
```javascript
// Service (business logic)
export const generateWorkout = async (user_id) => { ... }

// Controller (route handler)
export const generateWorkoutPlan = async (req, res) => {
  const result = await workoutService.generateWorkout(req.user_id);
  res.json(result);
}

// Route
router.post('/', authMiddleware, controller.generateWorkoutPlan);
```

## 📈 Next Steps

1. **Add More Features**:
   - Email notifications
   - Social features
   - Advanced AI (OpenAI API)

2. **Optimize**:
   - Database indexing
   - Caching
   - Code splitting

3. **Deploy**:
   - Backend to Heroku/Railway/Render
   - Frontend to Vercel/Netlify
   - Database to MongoDB Atlas

4. **Monitor**:
   - Error tracking (Sentry)
   - Analytics
   - Performance monitoring

## 🎯 Feature Highlights

| Feature | Status | Location |
|---------|--------|----------|
| User Auth | ✅ Complete | `/api/auth/*` |
| Health Metrics | ✅ Complete | `/api/profile` |
| Workout Generation | ✅ Complete | `/api/workouts` |
| Diet Planning | ✅ Complete | `/api/diet` |
| Progress Tracking | ✅ Complete | `/api/progress` |
| Habit Scoring | ✅ Complete | `/api/progress/habits` |
| Energy Logging | ✅ Complete | `/api/progress/energy` |
| Drop-off Detection | ✅ Complete | `/api/progress/dropoff/check` |
| Goal Forecasting | ✅ Complete | `/api/progress/forecast/goal` |
| AI Coach | ✅ Complete | `/api/assistant/ask` |
| Visualizations | ✅ Complete | Dashboard/Progress pages |
| Mobile Responsive | ✅ Complete | Tailwind CSS |

## 💡 Pro Tips

- Enable MongoDB Atlas connection string in `.env` for production DB
- Use nodemon in backend for auto-restart on code changes
- Use React DevTools browser extension for debugging frontend
- Check Network tab in browser DevTools to see API calls
- Use MongoDB Compass to visualize database

## 🎉 You're All Set!

FitAI is fully implemented and ready to use. Start with registration and explore all features. Refer to README.md and docs/API_ENDPOINTS.md for detailed documentation.

**Happy coding! 🚀**
