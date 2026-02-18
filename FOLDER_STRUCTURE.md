FitAI/
│
├── 📖 README.md                    # Main project documentation
├── 📖 QUICK_START.md              # Quick reference guide
├── 📖 SETUP.md                    # Setup instructions
├── 📖 PROJECT_SUMMARY.md          # Detailed project summary
│
├── backend/                        # Node.js + Express API
│   │
│   ├── 📁 models/                 # Database Schemas (8 files)
│   │   ├── User.js               # User auth model with bcrypt
│   │   ├── Profile.js            # Health metrics + BMI/BMR calculations
│   │   ├── WorkoutPlan.js        # Workout plan structure
│   │   ├── DietPlan.js           # Diet/macro plan structure
│   │   ├── ProgressLog.js        # Weekly progress tracking
│   │   ├── HabitScore.js         # Habit score calculations
│   │   ├── EnergyLog.js          # Energy/fatigue tracking
│   │   └── BodyMeasurement.js    # Body measurements (waist, chest, etc)
│   │
│   ├── 📁 controllers/            # Route Handlers (6 files)
│   │   ├── authController.js     # Register/login/profile
│   │   ├── profileController.js  # Profile CRUD
│   │   ├── workoutController.js  # Workout generation & retrieval
│   │   ├── dietController.js     # Diet generation & retrieval
│   │   ├── progressController.js # Progress, habits, energy, measurements
│   │   └── assistantController.js # AI coach question handling
│   │
│   ├── 📁 routes/                 # API Route Definitions (6 files)
│   │   ├── authRoutes.js         # POST register, login / GET profile
│   │   ├── profileRoutes.js      # POST/GET/PUT /api/profile
│   │   ├── workoutRoutes.js      # POST/GET /api/workouts/*
│   │   ├── dietRoutes.js         # POST/GET /api/diet/*
│   │   ├── progressRoutes.js     # POST/GET /api/progress/*
│   │   └── assistantRoutes.js    # POST /api/assistant/ask
│   │
│   ├── 📁 services/               # Business Logic Layer (7 files)
│   │   ├── authService.js        # Register, login, get user
│   │   ├── profileService.js     # Create/update profile with calcs
│   │   ├── workoutService.js     # Generate & retrieve workout plans
│   │   ├── dietService.js        # Generate & retrieve diet plans
│   │   ├── progressService.js    # Log progress, calculate scores, detect risks
│   │   ├── measurementService.js # Body measurements tracking
│   │   └── assistantService.js   # AI coach rule-based responses
│   │
│   ├── 📁 middleware/             # Middleware (1 file)
│   │   └── authMiddleware.js     # JWT token validation
│   │
│   ├── 📁 utils/                  # Utility Functions (3 files)
│   │   ├── calculationUtils.js   # BMI, BMR, TDEE, calorie calculations
│   │   ├── workoutGenerator.js   # Workout templates for different levels
│   │   └── dietGenerator.js      # Diet plan generation logic
│   │
│   ├── server.js                  # Express app setup, routes, server start
│   ├── package.json              # Dependencies: express, mongoose, bcrypt, jwt
│   ├── .env.example              # Environment variable template
│   └── .gitignore                # Git ignore rules
│
├── frontend/                       # React + Vite Application
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 pages/              # Full Page Components (9 files)
│   │   │   ├── LandingPage.js        # Hero, features, CTAs
│   │   │   ├── LoginPage.js          # Email/password login form
│   │   │   ├── RegisterPage.js       # User registration form
│   │   │   ├── ProfileSetupPage.js   # Health metrics form
│   │   │   ├── DashboardPage.js      # Main dashboard with widgets
│   │   │   ├── WorkoutPage.js        # 7-day workout display
│   │   │   ├── DietPage.js           # Daily meal plan display
│   │   │   ├── ProgressPage.js       # Charts and analytics
│   │   │   └── AssistantPage.js      # AI coach interface
│   │   │
│   │   ├── 📁 components/         # Reusable Components (extensible)
│   │   │   └── (Add your own here)
│   │   │
│   │   ├── 📁 context/            # Global State Management (1 file)
│   │   │   └── AuthContext.js     # Authentication state provider
│   │   │
│   │   ├── 📁 services/           # API Integration (1 file)
│   │   │   └── apiService.js      # Axios wrapper with all endpoints
│   │   │
│   │   ├── 📁 hooks/              # Custom React Hooks (extensible)
│   │   │   └── (Add your own here)
│   │   │
│   │   ├── 📁 utils/              # Frontend Utilities (extensible)
│   │   │   └── (Add your own here)
│   │   │
│   │   ├── App.js                 # Router setup, main component
│   │   ├── main.jsx               # React DOM render entry point
│   │   └── index.css              # Global styles with Tailwind directives
│   │
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite build configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── package.json              # Dependencies: react, axios, recharts
│   └── .gitignore                # Git ignore rules
│
├── docs/                          # Documentation
│   └── API_ENDPOINTS.md          # Complete API reference with examples
│
└── .gitignore                    # Root git ignore (if using monorepo)

════════════════════════════════════════════════════════════════

FILE COUNT SUMMARY:
─────────────────
Backend:
  • Models: 8 files
  • Controllers: 6 files
  • Routes: 6 files
  • Services: 7 files
  • Middleware: 1 file
  • Utils: 3 files
  • Config: 3 files
  Total Backend: 34 files

Frontend:
  • Pages: 9 files
  • Context: 1 file
  • Services: 1 file
  • Config: 6 files
  Total Frontend: 17 files

Documentation:
  • 5 markdown files
  • 1 docs folder

Total Project: 56+ Files

════════════════════════════════════════════════════════════════

KEY FEATURES BY LOCATION:
─────────────────────────

Authentication:
  → backend/models/User.js
  → backend/services/authService.js
  → backend/routes/authRoutes.js
  → frontend/context/AuthContext.js

Health Metrics & Calculations:
  → backend/models/Profile.js
  → backend/services/profileService.js
  → backend/utils/calculationUtils.js

Workout Planning:
  → backend/models/WorkoutPlan.js
  → backend/services/workoutService.js
  → backend/utils/workoutGenerator.js
  → frontend/pages/WorkoutPage.js

Diet Planning:
  → backend/models/DietPlan.js
  → backend/services/dietService.js
  → backend/utils/dietGenerator.js
  → frontend/pages/DietPage.js

Progress Tracking:
  → backend/models/ProgressLog.js, HabitScore.js, EnergyLog.js, BodyMeasurement.js
  → backend/services/progressService.js, measurementService.js
  → frontend/pages/ProgressPage.js

AI Coach:
  → backend/services/assistantService.js
  → frontend/pages/AssistantPage.js

════════════════════════════════════════════════════════════════

API ENDPOINTS ORGANIZATION:
──────────────────────────

Authentication (3 endpoints):
  /api/auth/register
  /api/auth/login
  /api/auth/profile

Profile (3 endpoints):
  /api/profile (POST, GET, PUT)

Workouts (4 endpoints):
  /api/workouts (POST, GET)
  /api/workouts/latest (GET)
  /api/workouts/week/:id (GET)

Diet (4 endpoints):
  /api/diet (POST, GET)
  /api/diet/latest (GET)
  /api/diet/week/:id (GET)

Progress & Tracking (13 endpoints):
  /api/progress/* (POST, GET)
  /api/progress/habits/* (GET)
  /api/progress/energy/* (POST, GET)
  /api/progress/measurements/* (POST, GET)
  /api/progress/dropoff/check (GET)
  /api/progress/forecast/goal (GET)

AI Coach (1 endpoint):
  /api/assistant/ask (POST)

Total: 30+ Endpoints

════════════════════════════════════════════════════════════════

DATABASE COLLECTIONS (MongoDB):
───────────────────────────────

Users:
  • For authentication & user data
  • Hashed passwords with bcrypt

Profiles:
  • BMI, BMR, calorie targets
  • All calculations stored

WorkoutPlans:
  • 7-day plans with exercises
  • Sets, reps, rest, intensity

DietPlans:
  • Daily calorie & macro targets
  • 4-5 meals per day

ProgressLogs:
  • Weekly weight & adherence
  • Daily workout/diet tracking

HabitScores:
  • Weekly habit score (0-100)
  • Streaks, monthly averages

EnergyLogs:
  • Daily energy/fatigue levels
  • Recovery insights

BodyMeasurements:
  • Waist, chest, hips, arms, thighs
  • Monthly comparisons

════════════════════════════════════════════════════════════════

QUICK NAVIGATION:
─────────────────

Want to understand...

User Registration?
  → backend/models/User.js
  → backend/services/authService.js
  → backend/controllers/authController.js

How BMI/Calories are Calculated?
  → backend/utils/calculationUtils.js
  → backend/services/profileService.js

Workout Generation Logic?
  → backend/utils/workoutGenerator.js (Beginner/Intermediate/Advanced templates)
  → backend/services/workoutService.js (orchestration)

How AI Coach Works?
  → backend/services/assistantService.js (rule-based responses)
  → frontend/pages/AssistantPage.js (UI)

Frontend Routing?
  → frontend/src/App.js (all routes defined here)
  → frontend/src/context/AuthContext.js (auth flow)

API Calls?
  → frontend/src/services/apiService.js (all endpoints)

════════════════════════════════════════════════════════════════
