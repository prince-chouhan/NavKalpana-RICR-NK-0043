import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 13,
    max: 120
  },
  biological_sex: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  height_cm: {
    type: Number,
    required: [true, 'Height is required'],
    min: 100,
    max: 250
  },
  weight_kg: {
    type: Number,
    required: [true, 'Weight is required'],
    min: 30,
    max: 500
  },
  activity_level: {
    type: String,
    enum: ['Sedentary', 'Light', 'Moderate', 'Active'],
    required: true
  },
  experience_level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  goal: {
    type: String,
    enum: ['Weight Loss', 'Muscle Gain', 'Maintenance'],
    required: true
  },
  target_weight_kg: {
    type: Number,
    required: true,
    min: 30,
    max: 500
  },
  // Calculated fields
  bmi: Number,
  bmr: Number,
  daily_calorie_target: Number,
  height_m: Number,
  activity_factor: Number,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Profile', profileSchema);
