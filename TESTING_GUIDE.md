# FitAI Testing Guide

## 🚀 Complete Testing Walkthrough

This guide walks you through testing every feature of FitAI step-by-step.

---

## Prerequisites

✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:3000
✅ MongoDB running locally or connection string configured
✅ Browser open to http://localhost:3000

---

## Phase 1: Authentication Testing

### Test 1.1: User Registration

**Steps:**
1. Navigate to http://localhost:3000
2. Click "Sign Up" or "Register here"
3. Fill in:
   - Name: "Test User"
   - Email: "test@fitai.com"
   - Password: "testpass123"
   - Confirm Password: "testpass123"
4. Click "Register"

**Expected Results:**
- ✅ Redirected to Profile Setup page
- ✅ Token saved in localStorage
- ✅ No error messages

**API Call (Backend):**
```
POST /api/auth/register
Response: { user: {...}, token: "jwt_token..." }
Database: User created in MongoDB
```

---

### Test 1.2: Login with Registered User

**Steps:**
1. From landing page, click "Login"
2. Enter:
   - Email: "test@fitai.com"
   - Password: "testpass123"
3. Click "Login"

**Expected Results:**
- ✅ Redirected to Dashboard (or Profile Setup if no profile)
- ✅ Token stored in localStorage
- ✅ User info displayed

**API Call:**
```
POST /api/auth/login
Response: { user: {...}, token: "jwt_token..." }
```

---

### Test 1.3: Logout

**Steps:**
1. From dashboard, look for logout button (typically in navbar)
2. Click logout

**Expected Results:**
- ✅ Redirected to landing page
- ✅ Token removed from localStorage
- ✅ Cannot access protected pages anymore

---

## Phase 2: Profile Setup Testing

### Test 2.1: Create Health Profile

**Steps:**
1. On Profile Setup page, fill all fields:
   - Age: 30
   - Biological Sex: Male
   - Height (cm): 180
   - Weight (kg): 85
   - Activity Level: Moderate
   - Experience Level: Beginner
   - Goal: Weight Loss
   - Target Weight (kg): 75
2. Click "Complete Setup"

**Expected Results:**
- ✅ Redirected to Dashboard
- ✅ Profile saved in database
- ✅ Calculations performed

**Backend Calculations to Verify:**
```
BMI = 85 / (1.80)² = 26.2
BMR (Male) = (10×85) + (6.25×180) - (5×30) + 5 = 1755
Activity Factor (Moderate) = 1.55
TDEE = 1755 × 1.55 = 2720
Daily Target (Weight Loss) = 2720 - 400 = 2320 kcal
```

**API Call:**
```
POST /api/profile
```

**Database:**
✅ Profile document created with calculated fields

---

### Test 2.2: Update Profile

**Steps:**
1. From dashboard, go to profile settings
2. Change target weight: 70 (instead of 75)
3. Save changes

**Expected Results:**
- ✅ Profile updated
- ✅ All calculations recalculated
- ✅ No data loss

**API Call:**
```
PUT /api/profile
```

---

## Phase 3: Workout Plan Testing

### Test 3.1: Generate Workout Plan

**Steps:**
1. From Dashboard, click "View Workout Plan"
2. Should see Week 1 plan automatically

**Expected Results:**
- ✅ 7-day workout plan displayed
- ✅ Each day shows: day name, type, exercises
- ✅ Each exercise shows: sets, reps, rest time, guidance, intensity

**Verify Content:**
- Day 1 (Monday): Full Body
  - Squats: 3 sets, 8-10 reps, 90s rest
  - Bench Press: 3 sets, 8-10 reps, 90s rest
  - Rows: 3 sets, 8-10 reps, 90s rest
  - Overhead Press: 2 sets, 8-10 reps, 60s rest
- Day 2 (Tuesday): Rest/Light Cardio
- Day 3 (Wednesday): Full Body
- etc.

**For Beginner Experience Level:**
- ✅ Should show 3 full-body days + 4 rest days
- ✅ Light-moderate intensity
- ✅ Lower volume exercises

**API Calls:**
```
POST /api/workouts (generates new plan)
GET /api/workouts/latest (retrieves it)
```

---

### Test 3.2: View Different Weeks

**Steps:**
1. Generate another workout (week 2)
2. Check previous week

**Expected Results:**
- ✅ Can retrieve previous week's plan
- ✅ Week numbers increase sequentially

**API Call:**
```
GET /api/workouts/week/1
GET /api/workouts/week/2
```

---

### Test 3.3: Verify Plan Adaptation to Experience Level

**Create two profiles** with different experience levels and verify:
- Beginner: Full body, 3 days
- Intermediate: Push/Pull/Leg, 6 days
- Advanced: Heavy/Accessory/Volume, 6 days

---

## Phase 4: Diet Plan Testing

### Test 4.1: Generate Diet Plan

**Steps:**
1. From Dashboard, click "View Diet Plan"

**Expected Results:**
- ✅ Daily calorie target displayed
- ✅ Macro targets displayed (P/C/F with percentages)
- ✅ 4-5 meals shown with descriptions
- ✅ Each meal has calorie and macro breakdown

**Verify Calculations** (for Weight Loss goal with 2320 kcal):
```
Macro Split (Weight Loss: 40/30/30):
- Protein: (0.40 × 2320) / 4 = 232g
- Carbs: (0.30 × 2320) / 4 = 174g
- Fat: (0.30 × 2320) / 9 = 77g

Per Meal (÷4):
- Protein: 58g
- Carbs: 44g
- Fat: 19g
```

**Sample Meal Structure:**
- Meal 1 (Breakfast): Oats with protein
- Meal 2 (Snack): Greek yogurt
- Meal 3 (Lunch): Chicken & rice
- Meal 4 (Dinner): Salmon & vegetables

**API Call:**
```
POST /api/diet (generates new plan)
GET /api/diet/latest (retrieves it)
```

---

### Test 4.2: Verify Macros by Goal

Create profiles with different goals and verify:
- **Weight Loss**: 40% protein (higher for satiety)
- **Muscle Gain**: 30% protein, 50% carbs (more carbs for training)

---

## Phase 5: Progress Tracking Testing

### Test 5.1: Log Weekly Progress

**Steps:**
1. From Dashboard, click "Log Progress" or go to /progress
2. Fill in:
   - Week: 1
   - Weight: 82 kg (started at 85)
   - Daily Logs:
     - Day 1: Completed workout, Followed diet
     - Day 2: Partial workout, Mostly followed diet
     - Days 3-7: Log your activity

**Expected Results:**
- ✅ Progress saved
- ✅ Adherence % calculated
- ✅ Habit score calculated

**Verify Calculations:**
```
If 5 completed + 2 partial workouts:
Workout Adherence = (5×100 + 2×50) / 7 = 71%

If 4 followed + 3 mostly followed diets:
Diet Adherence = (4×100 + 3×75) / 7 = 79%

Habit Score = (71 × 0.60) + (79 × 0.40) = 73
```

**API Call:**
```
POST /api/progress
```

---

### Test 5.2: View Progress Charts

**Steps:**
1. From Dashboard, click "Log Progress" tab or /progress page
2. Switch between tabs: Weight, Adherence, Habits

**Expected Results:**
- ✅ Weight trend line chart (shows -3kg change)
- ✅ Adherence bar chart (workout % and diet %)
- ✅ Habit score trend line

**Interactive:**
- ✅ Hover over data points to see values
- ✅ Charts are responsive

**API Calls:**
```
GET /api/progress/recent?weeks=12
GET /api/progress/habits
```

---

## Phase 6: Habit Scoring Testing

### Test 6.1: Check Current Habit Score

**Steps:**
1. From Dashboard, look for Habit Score card
2. Should show current score and streak

**Expected Results:**
- ✅ Score: 0-100
- ✅ Streak count displayed (e.g., "1 week")
- ✅ If score ≥ 70 for consecutive weeks, streak increases

**API Call:**
```
GET /api/progress/habits/current
```

---

### Test 6.2: Verify Streak Calculation

**Scenario:**
- Week 1 Habit Score: 75 → Streak = 1
- Week 2 Habit Score: 80 → Streak = 2
- Week 3 Habit Score: 65 → Streak = 1 (resets, below 70)

---

## Phase 7: Energy & Recovery Testing

### Test 7.1: Log Energy Level

**Steps:**
1. Go to Progress page
2. Look for "Log Energy" section (or API call)
3. Select: "Energized" / "Normal" / "Slightly Fatigued" / "Very Tired"
4. Add optional notes: "Felt great today"
5. Submit

**Expected Results:**
- ✅ Energy log saved
- ✅ Can be retrieved for last 7 days

**API Calls:**
```
POST /api/progress/energy
GET /api/progress/energy/recent?days=7
```

---

### Test 7.2: Verify Fatigue Logic

**Test Scenario:**
- Log "Very Tired" for 3 consecutive days
- On day 4, next week's workout should be recovery week (light mobility)

**Expected:**
- Fatigue flag count = 3
- Recovery week triggered automatically
- Lighter exercises suggested

---

## Phase 8: Body Measurements Testing

### Test 8.1: Log Measurements

**Steps:**
1. Go to Progress page
2. Find "Body Measurements" section
3. Fill in:
   - Waist: 85 cm
   - Chest: 100 cm
   - Hips: 95 cm
   - Left Arm: 32 cm
   - Right Arm: 32 cm
   - Left Thigh: 55 cm
   - Right Thigh: 55 cm
   - Notes: "Morning, fasted"
4. Save

**Expected Results:**
- ✅ Measurements saved with date
- ✅ Can retrieve latest
- ✅ Can see historical data

**API Calls:**
```
POST /api/progress/measurements
GET /api/progress/measurements/latest
GET /api/progress/measurements
```

---

### Test 8.2: Compare Measurements Over Time

**Steps:**
1. Log measurements on day 1
2. Wait or create another entry
3. Check comparison

**Expected:**
- ✅ Shows change in each measurement
- ✅ Delta calculation (new - old)

---

## Phase 9: Drop-off Risk Detection Testing

### Test 9.1: Trigger Drop-off Warning

**Scenario to create:**
- Log 3 consecutive "Skipped" workouts
- OR don't log anything for 14 days
- OR log diet adherence < 40% for 2 weeks

**Expected Result:**
- ✅ /api/progress/dropoff/check returns at_risk: true
- ✅ Dashboard shows warning
- ✅ Recommendations displayed

**API Call:**
```
GET /api/progress/dropoff/check
Response: {
  at_risk: true,
  reasons: ["3 missed workouts in a row"],
  recommendations: ["Offer lighter plan"]
}
```

---

## Phase 10: Goal Forecasting Testing

### Test 10.1: Check Goal Timeline

**Steps:**
1. After logging 2+ weeks of progress with consistent weight changes
2. View dashboard or call forecast endpoint

**Expected Result:**
```
GET /api/progress/forecast/goal
Response: {
  estimated_weeks: 20,
  avg_weekly_change: -0.5,
  confidence: "Medium"
}
```

**If started at 85kg, target 75kg:**
- Weight to lose: 10kg
- Avg change per week: -0.5kg
- Estimated time: 20 weeks
- Estimated date: ~5 months from now

---

## Phase 11: AI Coach Testing

### Test 11.1: Ask About Weight Loss

**Steps:**
1. Go to Assistant page (/assistant)
2. Ask: "Why am I not losing weight?"
3. Submit

**Expected Response:**
- ✅ Analyzes your diet adherence
- ✅ Checks workout consistency
- ✅ Provides specific recommendation based on YOUR data
- ✅ Shows actionable steps

**Example Response:**
```
If diet adherence < 60%:
"Your diet adherence is below 60%. This is the primary factor in weight loss.
Focus on hitting your calorie target consistently.

Action Steps:
1. Your daily target is 2320 kcal
2. Use a food tracking app to monitor calories
3. Plan meals the night before"
```

**API Call:**
```
POST /api/assistant/ask
{
  "question": "Why am I not losing weight?"
}
```

---

### Test 11.2: Ask About Protein

**Question:** "Should I increase protein?"

**Expected Response:**
- Shows current protein target
- Explains why (based on goal)
- Provides food sources

**Example:**
```
"For your goal of Weight Loss, aim for 232g of protein daily.
That's approximately 58g per meal (4 meals).
Prioritize protein at each meal.
Good sources: chicken, fish, eggs, greek yogurt, legumes"
```

---

### Test 11.3: Ask About Cardio

**Question:** "Can I skip cardio?"

**Expected Response:**
- Goal-specific answer
- Weight Loss: "Cardio is beneficial but not necessary if deficit maintained"
- Muscle Gain: "Keep cardio minimal to avoid interfering with gains"

---

### Test 11.4: Ask About Fatigue

**Question:** "How do I reduce fatigue?"

**Expected Response:**
- Sleep recommendations
- Nutrition check
- Recovery day suggestions

---

## Phase 12: Dashboard Integration Testing

### Test 12.1: Full Dashboard View

**Steps:**
1. Log in and go to Dashboard
2. Verify all widgets present:
   - Habit Score card
   - Status card (risk indicator)
   - This week's workout preview
   - Weight progress chart
   - Quick action links

**Expected Results:**
- ✅ All real data populated from database
- ✅ Charts are interactive
- ✅ All links functional

---

### Test 12.2: Data Persistence

**Steps:**
1. Log out from dashboard
2. Log back in
3. Return to dashboard

**Expected Results:**
- ✅ All data still there
- ✅ Charts show same values
- ✅ No data loss

---

## Phase 13: Frontend Responsiveness Testing

### Test 13.1: Mobile View

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - iPhone (375px)
   - Tablet (768px)
   - Desktop (1920px)

**Expected Results:**
- ✅ All pages responsive
- ✅ Buttons clickable
- ✅ Charts resize properly
- ✅ Forms stack on mobile
- ✅ Navigation works

---

## Phase 14: Error Handling Testing

### Test 14.1: Invalid Login

**Steps:**
1. Try to login with wrong password
2. Try non-existent email

**Expected Results:**
- ✅ Error message displayed: "Invalid credentials"
- ✅ Not logged in
- ✅ Stay on login page

---

### Test 14.2: Missing Required Fields

**Steps:**
1. Try to create profile without filling all fields
2. Try to submit empty forms

**Expected Results:**
- ✅ Error message: "All profile fields are required"
- ✅ Form not submitted
- ✅ Validation tooltip/highlight

---

### Test 14.3: Invalid Data

**Steps:**
1. Try to enter non-numeric values in height/weight
2. Try to enter negative numbers

**Expected Results:**
- ✅ Input validation prevents invalid data
- ✅ Error message shown
- ✅ Form won't submit

---

## Phase 15: API Testing (Using cURL)

### Test 15.1: Register via cURL

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"test123"}'
```

**Expected:**
```json
{
  "user": {"id":"...","name":"John Doe","email":"john@test.com"},
  "token": "eyJhbGc..."
}
```

---

### Test 15.2: Create Profile via cURL

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN" \
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

---

### Test 15.3: Generate Workout via cURL

```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"week_number":1}'
```

---

## Test Summary Checklist

### Authentication
- [ ] User registration
- [ ] User login
- [ ] Token storage
- [ ] Protected routes
- [ ] Logout
- [ ] Invalid login error

### Profile
- [ ] Create profile with all fields
- [ ] BMI calculated correctly
- [ ] BMR calculated correctly
- [ ] Calorie target calculated
- [ ] Update profile

### Workouts
- [ ] Generate workout plan
- [ ] Correct experience level adaptation
- [ ] All 7 days populated
- [ ] Exercise details complete
- [ ] Rest days shown

### Diet
- [ ] Generate diet plan
- [ ] Daily calorie target shown
- [ ] Macros calculated correctly
- [ ] 4-5 meals displayed
- [ ] Meal breakdowns accurate

### Progress
- [ ] Log weekly progress
- [ ] Adherence % calculated
- [ ] Weight trend chart
- [ ] Adherence chart
- [ ] Historical data preserved

### Habits
- [ ] Habit score calculated
- [ ] Streak counted
- [ ] Score range 0-100

### Energy
- [ ] Log energy level
- [ ] Retrieve recent logs
- [ ] Fatigue logic works

### Measurements
- [ ] Log measurements
- [ ] Retrieve latest
- [ ] View history

### Risk Detection
- [ ] Drop-off risk detected
- [ ] Recommendations shown

### Forecasting
- [ ] Goal timeline calculated
- [ ] Confidence level shown

### AI Coach
- [ ] Ask questions
- [ ] Get data-driven responses
- [ ] Suggestions provided
- [ ] Different responses for different goals

### UI/UX
- [ ] All pages responsive
- [ ] Charts interactive
- [ ] Buttons functional
- [ ] Error messages clear
- [ ] Form validation works

### Performance
- [ ] Pages load quickly
- [ ] No console errors
- [ ] API calls complete
- [ ] Charts render smoothly

---

## Common Issues & Troubleshooting

### Issue: "MongoDB connection refused"
**Solution:** Start MongoDB
```bash
mongod
```

### Issue: "Cannot GET /api/profile"
**Solution:** Make sure backend server is running
```bash
cd backend && npm run dev
```

### Issue: Token expired
**Solution:** Log out and log back in

### Issue: 404 on API calls
**Solution:** Check endpoint in Network tab, verify routes in backend

### Issue: CORS error
**Solution:** Check backend CORS configuration in server.js

---

## Performance Benchmarks (Expected)

- Page load: < 2 seconds
- API response: < 200ms
- Chart rendering: < 1 second
- Database query: < 100ms

---

## Conclusion

✅ If all tests pass, FitAI is fully functional!

Happy testing! 🚀
