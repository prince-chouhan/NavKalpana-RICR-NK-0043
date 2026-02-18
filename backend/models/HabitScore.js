import mongoose from 'mongoose';

const habitScoreSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  week_number: Number,
  date: {
    type: Date,
    default: Date.now
  },
  workout_adherence_percent: Number,
  diet_adherence_percent: Number,
  // Formula: (Workout Adherence × 0.60) + (Diet Adherence × 0.40)
  habit_score: {
    type: Number,
    min: 0,
    max: 100
  },
  streak_count: {
    type: Number,
    default: 0
  },
  monthly_average: Number,
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('HabitScore', habitScoreSchema);
