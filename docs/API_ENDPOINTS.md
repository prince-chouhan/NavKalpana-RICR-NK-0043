# FitAI API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer {token}
```

### Auth Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}

Response (201):
{
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
  "token": "eyJhbGc..."
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}

Response (200):
{
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
  "token": "eyJhbGc..."
}
```

#### Get Authenticated User
```
GET /auth/profile
Authorization: Bearer {token}

Response (200):
{
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "created_at": "..." }
}
```

---

## Profile Endpoints

### Create Profile
```
POST /profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "age": 30,
  "biological_sex": "Male",
  "height_cm": 180,
  "weight_kg": 85,
  "activity_level": "Moderate",
  "experience_level": "Beginner",
  "goal": "Weight Loss",
  "target_weight_kg": 75
}

Response (201):
{
  "_id": "...",
  "user_id": "...",
  "age": 30,
  "bmi": 26.2,
  "bmr": 1750,
  "daily_calorie_target": 2100,
  "activity_factor": 1.55,
  ...
}
```

### Get Profile
```
GET /profile
Authorization: Bearer {token}

Response (200):
{ profile object }
```

### Update Profile
```
PUT /profile
Authorization: Bearer {token}
Content-Type: application/json

{ updated fields }

Response (200):
{ updated profile object }
```

---

## Workout Endpoints

### Generate Workout Plan
```
POST /workouts
Authorization: Bearer {token}
Content-Type: application/json

{
  "week_number": 1
}

Response (201):
{
  "_id": "...",
  "user_id": "...",
  "week_number": 1,
  "goal": "Weight Loss",
  "experience_level": "Beginner",
  "workouts": [
    {
      "day": 1,
      "day_name": "Monday",
      "type": "Full Body",
      "exercises": [
        {
          "name": "Squats",
          "sets": 3,
          "reps": "8-10",
          "rest_seconds": 90,
          "guidance": "Full depth, control descent",
          "intensity_level": "Moderate"
        }
      ],
      "rest_day": false
    }
  ]
}
```

### Get Latest Workout
```
GET /workouts/latest
Authorization: Bearer {token}

Response (200):
{ latest workout plan }
```

### Get Workout by Week
```
GET /workouts/week/:week_number
Authorization: Bearer {token}

Response (200):
{ workout plan for specified week }
```

### Get All Workouts
```
GET /workouts
Authorization: Bearer {token}

Response (200):
[ array of all workout plans ]
```

---

## Diet Endpoints

### Generate Diet Plan
```
POST /diet
Authorization: Bearer {token}
Content-Type: application/json

{
  "week_number": 1
}

Response (201):
{
  "_id": "...",
  "user_id": "...",
  "week_number": 1,
  "daily_calorie_target": 2100,
  "goal": "Weight Loss",
  "protein_grams": 210,
  "protein_percent": 40,
  "carbs_grams": 158,
  "carbs_percent": 30,
  "fat_grams": 70,
  "fat_percent": 30,
  "meals": [
    {
      "meal_number": 1,
      "meal_name": "Breakfast",
      "description": "Oats with protein powder and banana",
      "estimated_calories": 525,
      "macros": { "protein_g": 52, "carbs_g": 39, "fat_g": 17 }
    }
  ]
}
```

### Get Latest Diet
```
GET /diet/latest
Authorization: Bearer {token}

Response (200):
{ latest diet plan }
```

### Get Diet by Week
```
GET /diet/week/:week_number
Authorization: Bearer {token}

Response (200):
{ diet plan for specified week }
```

### Get All Diets
```
GET /diet
Authorization: Bearer {token}

Response (200):
[ array of all diet plans ]
```

---

## Progress Endpoints

### Log Progress
```
POST /progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "week_number": 1,
  "weight_kg": 82,
  "daily_logs": [
    { "day_number": 1, "date": "2024-01-01", "workout_completion": "Completed", "diet_adherence": "Followed" },
    { "day_number": 2, "date": "2024-01-02", "workout_completion": "Partial", "diet_adherence": "Mostly" }
  ]
}

Response (201):
{
  "week_number": 1,
  "weight_kg": 82,
  "workout_adherence_percent": 75,
  "diet_adherence_percent": 85,
  "avg_weight_change": -3
}
```

### Get Progress by Week
```
GET /progress/week/:week_number
Authorization: Bearer {token}

Response (200):
{ progress log for specified week }
```

### Get All Progress
```
GET /progress
Authorization: Bearer {token}

Response (200):
[ array of all progress logs ]
```

### Get Recent Progress
```
GET /progress/recent?weeks=12
Authorization: Bearer {token}

Response (200):
[ last 12 weeks of progress ]
```

---

## Habit Score Endpoints

### Get All Habit Scores
```
GET /progress/habits
Authorization: Bearer {token}

Response (200):
[
  {
    "week_number": 1,
    "workout_adherence_percent": 75,
    "diet_adherence_percent": 85,
    "habit_score": 79,
    "streak_count": 1,
    "monthly_average": 79
  }
]
```

### Get Current Habit Score
```
GET /progress/habits/current
Authorization: Bearer {token}

Response (200):
{ current week habit score }
```

---

## Energy & Recovery Endpoints

### Log Energy Level
```
POST /progress/energy
Authorization: Bearer {token}
Content-Type: application/json

{
  "energy_level": "Normal",
  "notes": "Felt good today"
}

Response (201):
{
  "user_id": "...",
  "date": "2024-01-15",
  "energy_level": "Normal",
  "notes": "Felt good today"
}
```

### Get Recent Energy Logs
```
GET /progress/energy/recent?days=7
Authorization: Bearer {token}

Response (200):
[ last 7 days of energy logs ]
```

---

## Body Measurements Endpoints

### Log Body Measurements
```
POST /progress/measurements
Authorization: Bearer {token}
Content-Type: application/json

{
  "measurements": {
    "waist_cm": 85,
    "chest_cm": 100,
    "hips_cm": 95,
    "left_arm_cm": 32,
    "right_arm_cm": 32,
    "left_thigh_cm": 55,
    "right_thigh_cm": 55
  },
  "notes": "Morning measurement"
}

Response (201):
{ measurement log }
```

### Get Latest Measurements
```
GET /progress/measurements/latest
Authorization: Bearer {token}

Response (200):
{ latest measurement log }
```

### Get All Measurements
```
GET /progress/measurements
Authorization: Bearer {token}

Response (200):
[ array of all measurement logs ]
```

---

## Risk Detection & Forecasting

### Check Drop-off Risk
```
GET /progress/dropoff/check
Authorization: Bearer {token}

Response (200):
{
  "at_risk": false,
  "reasons": [],
  "recommendations": []
}
```

### Forecast Goal Achievement
```
GET /progress/forecast/goal
Authorization: Bearer {token}

Response (200):
{
  "estimated_weeks": 20,
  "avg_weekly_change": -0.5,
  "confidence": "Medium"
}
```

---

## AI Assistant Endpoints

### Ask Fitness Coach
```
POST /assistant/ask
Authorization: Bearer {token}
Content-Type: application/json

{
  "question": "Why am I not losing weight?"
}

Response (200):
{
  "response": "Your diet adherence is below 60%...",
  "steps": [
    "Your daily target is 1900 kcal",
    "Use a food tracking app",
    "Plan meals the night before"
  ],
  "confidence": "High"
}
```

---

## Error Responses

### 400 Bad Request
```json
{ "error": "All profile fields are required" }
```

### 401 Unauthorized
```json
{ "error": "Invalid or expired token" }
```

### 404 Not Found
```json
{ "error": "Profile not found" }
```

### 500 Server Error
```json
{ "error": "Something went wrong" }
```

---

## Status Codes

- **200** - OK
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **500** - Server Error
