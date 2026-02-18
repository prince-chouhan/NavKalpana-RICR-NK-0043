import mongoose from 'mongoose';
import WorkoutPlan from '../models/WorkoutPlanV2.js';
import ProgressLog from '../models/ProgressLog.js';
import { generateWeeklyWorkout } from '../utils/workoutGenerator.js';
import { generateAIWorkoutPlan } from './groqService.js';
import Profile from '../models/Profile.js';

export const generateWorkoutPlan = async (user_id, week_number = 1) => {
  // Get user profile for goal and experience level
  const profile = await Profile.findOne({ user_id });
  
  if (!profile) {
    throw new Error('Profile not found. Please complete profile setup first.');
  }
  
  let workoutDays, weekSummary, progressionNotes, recoveryTips, motivationMessage;
  
  // Debug: Check API key
  console.log('🔍 Checking Groq API key for workout generation...');
  console.log('API Key exists:', !!process.env.GROQ_API_KEY);
  
  // Try to use AI if API key is configured
  if (process.env.GROQ_API_KEY && 
      process.env.GROQ_API_KEY !== 'your_groq_api_key_here' && 
      process.env.GROQ_API_KEY.trim() !== '') {
    try {
      console.log(`✅ Groq API configured! Generating AI-powered workout plan for user ${user_id}, week ${week_number}...`);
      const aiPlan = await generateAIWorkoutPlan(user_id, week_number);
      workoutDays = aiPlan.weekly_schedule;
      weekSummary = aiPlan.week_summary;
      progressionNotes = aiPlan.progression_notes;
      recoveryTips = aiPlan.recovery_tips;
      motivationMessage = aiPlan.motivation_message;
    } catch (error) {
      console.error('❌ Groq AI generation failed, falling back to template:', error.message);
      // Fallback to template-based generation
      workoutDays = generateWeeklyWorkout(profile.goal, profile.experience_level, 'Normal');
      weekSummary = `Week ${week_number} - ${profile.experience_level} ${profile.goal} Program`;
    }
  } else {
    console.log('⚠️  Using template-based workout generation (Groq AI not configured)');
    // Use template-based generation
    workoutDays = generateWeeklyWorkout(profile.goal, profile.experience_level, 'Normal');
    weekSummary = `Week ${week_number} - ${profile.experience_level} ${profile.goal} Program`;
  }
  
  // Validate workoutDays is an array
  if (!Array.isArray(workoutDays)) {
    console.error('workoutDays is not an array:', typeof workoutDays, workoutDays);
    throw new Error('Invalid workout data structure');
  }
  
  console.log(`Creating workout plan with ${workoutDays.length} days`);
  console.log('First workout day structure:', JSON.stringify(workoutDays[0], null, 2));
  
  // Create plain object first
  const workoutData = {
    user_id,
    week_number,
    goal: profile.goal,
    experience_level: profile.experience_level,
    fatigue_status: 'Normal',
    workouts: JSON.parse(JSON.stringify(workoutDays)), // Deep clone to avoid reference issues
    week_summary: weekSummary,
    progression_notes: progressionNotes,
    recovery_tips: recoveryTips,
    motivation_message: motivationMessage
  };
  
  console.log('About to save workout data...');
  console.log('Workouts array length:', workoutData.workouts.length);
  
  try {
    // Use insertOne directly to bypass Mongoose issues
    const result = await mongoose.connection.db.collection('workoutplans').insertOne(workoutData);
    console.log('✅ Workout plan saved successfully with ID:', result.insertedId);
    
    // Fetch the saved document
    const savedPlan = await mongoose.connection.db.collection('workoutplans').findOne({ _id: result.insertedId });
    console.log('Saved plan has', savedPlan.workouts.length, 'workout days');
    
    return savedPlan;
  } catch (saveError) {
    console.error('❌ Error saving workout plan:', saveError.message);
    throw saveError;
  }
};

export const getLatestWorkoutPlan = async (user_id) => {
  const workoutPlan = await WorkoutPlan.findOne({ user_id }).sort({ created_at: -1 });
  
  if (!workoutPlan) {
    // Generate first week plan if none exists
    return await generateWorkoutPlan(user_id, 1);
  }
  
  return workoutPlan;
};

export const getWorkoutPlanByWeek = async (user_id, week_number) => {
  const workoutPlan = await WorkoutPlan.findOne({ user_id, week_number });
  
  if (!workoutPlan) {
    throw new Error('Workout plan not found for this week');
  }
  
  return workoutPlan;
};

export const getAllWorkoutPlans = async (user_id) => {
  return await WorkoutPlan.find({ user_id }).sort({ week_number: 1 });
};
