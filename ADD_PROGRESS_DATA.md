# 📊 How to Add Progress Data

Your Progress page is ready, but it needs data to display. Here are two ways to add progress data:

---

## Option 1: Add Sample Data (Quick Test) ⚡

Run this script to automatically add 8 weeks of sample progress data:

```bash
cd backend
node scripts/addSampleProgress.js
```

This will create:
- ✅ 8 weeks of progress logs (weight, adherence rates)
- ✅ 8 habit scores with streak counts
- ✅ 56 energy logs (7 days × 8 weeks)
- ✅ 4 body measurement records

**Then refresh your Progress page to see the charts!**

---

## Option 2: Add Real Data via API 📝

### 1. Log Weekly Progress

**Endpoint:** `POST /api/progress/log`

**Body:**
```json
{
  "week_number": 1,
  "weight_kg": 75.5,
  "daily_logs": [
    {
      "day_number": 1,
      "workout_completed": true,
      "diet_followed": true,
      "notes": "Great start!"
    },
    {
      "day_number": 2,
      "workout_completed": true,
      "diet_followed": false,
      "notes": ""
    },
    // ... 7 days total
  ]
}
```

### 2. Log Energy Levels

**Endpoint:** `POST /api/progress/energy`

**Body:**
```json
{
  "energy_level": "High",
  "notes": "Feeling great today!"
}
```

### 3. Log Body Measurements

**Endpoint:** `POST /api/progress/measurements`

**Body:**
```json
{
  "measurements": {
    "chest_cm": 95,
    "waist_cm": 85,
    "hips_cm": 100,
    "arms_cm": 32,
    "thighs_cm": 55
  },
  "notes": "Monthly measurements"
}
```

---

## What You'll See on Progress Page 📈

### Weight Progress Tab
- Line chart showing your weight trend over weeks
- See if you're moving toward your goal

### Adherence Tab
- Bar chart comparing workout vs diet adherence
- Shows your consistency week by week

### Habit Scores Tab
- Line chart of your overall habit scores
- Calculated from workout + diet adherence

---

## How Progress Data Trains Your AI 🤖

Once you have progress data, the AI uses it to:

1. **Analyze Trends**
   - "I see you've lost 3kg over 6 weeks..."
   - "Your adherence dropped in week 4..."

2. **Adapt Workouts**
   - High adherence (>80%) → Increase difficulty
   - Low adherence (<60%) → Simplify workouts

3. **Adjust Diet Plans**
   - Weight not changing → Adjust calories
   - Low energy → Modify carb timing

4. **Personalize Coaching**
   - Reference your specific statistics
   - Celebrate your achievements
   - Identify problem areas

---

## Quick Start 🚀

**Easiest way to test:**

```bash
# 1. Make sure backend is running
cd backend
npm start

# 2. In another terminal, add sample data
cd backend
node scripts/addSampleProgress.js

# 3. Refresh your Progress page in the browser
# You should now see charts with 8 weeks of data!
```

---

## Notes 📝

- Progress data is per user (uses your user_id from auth token)
- Habit scores are automatically calculated from adherence rates
- The AI receives ALL this data when generating plans or answering questions
- More data = Better AI personalization!

---

## Troubleshooting 🔧

**No data showing?**
1. Check if backend is running on port 5001
2. Check browser console for API errors
3. Verify you're logged in (auth token present)
4. Run the sample data script

**Script errors?**
1. Make sure MongoDB is running
2. Check that you have a user account created
3. Verify profile setup is complete
4. Check `.env` file has correct MongoDB URI
