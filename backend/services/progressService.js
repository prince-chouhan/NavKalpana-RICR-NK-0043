import ProgressLog from '../models/ProgressLog.js';
import HabitScore from '../models/HabitScore.js';
import EnergyLog from '../models/EnergyLog.js';
import { estimateWeeksToGoal, detectDropoffRisk } from '../utils/calculationUtils.js';

export const logProgress = async (user_id, progressData, week_number) => {
  // Calculate adherence percentages
  const workoutCompletions = progressData.daily_logs?.map(log => log.workout_completion) || [];
  const dietAdherences = progressData.daily_logs?.map(log => log.diet_adherence) || [];
  
  const workoutAdherence = calculateAdherence(workoutCompletions);
  const dietAdherence = calculateAdherence(dietAdherences);
  
  const progressLog = new ProgressLog({
    user_id,
    week_number,
    ...progressData,
    workout_adherence_percent: workoutAdherence,
    diet_adherence_percent: dietAdherence
  });
  
  await progressLog.save();
  
  // Calculate and save habit score
  await calculateAndSaveHabitScore(user_id, week_number, workoutAdherence, dietAdherence);
  
  return progressLog;
};

export const getProgressByWeek = async (user_id, week_number) => {
  return await ProgressLog.findOne({ user_id, week_number });
};

export const getAllProgress = async (user_id) => {
  return await ProgressLog.find({ user_id }).sort({ week_number: 1 });
};

export const getRecentProgress = async (user_id, weeksToFetch = 12) => {
  return await ProgressLog.find({ user_id })
    .sort({ week_number: -1 })
    .limit(weeksToFetch);
};

const calculateAdherence = (completionArray) => {
  if (!completionArray || completionArray.length === 0) return 0;
  
  const scores = {
    'Completed': 100,
    'Followed': 100,
    'Partial': 50,
    'Mostly': 75,
    'Skipped': 0,
    'Deviated': 0
  };
  
  const total = completionArray.reduce((sum, completion) => sum + (scores[completion] || 0), 0);
  return Math.round(total / completionArray.length);
};

const calculateAndSaveHabitScore = async (user_id, week_number, workoutAdherence, dietAdherence) => {
  // Formula: (Workout Adherence × 0.60) + (Diet Adherence × 0.40)
  const habitScore = Math.round((workoutAdherence * 0.60) + (dietAdherence * 0.40));
  
  // Get previous streak or start new one
  const previousScore = await HabitScore.findOne({ user_id }).sort({ week_number: -1 });
  let streak = 1;
  
  if (previousScore && previousScore.habit_score >= 70) {
    streak = previousScore.streak_count + 1;
  }
  
  const score = new HabitScore({
    user_id,
    week_number,
    workout_adherence_percent: workoutAdherence,
    diet_adherence_percent: dietAdherence,
    habit_score: habitScore,
    streak_count: streak
  });
  
  await score.save();
  return score;
};

export const getHabitScores = async (user_id) => {
  return await HabitScore.find({ user_id }).sort({ week_number: 1 });
};

export const getCurrentHabitScore = async (user_id) => {
  return await HabitScore.findOne({ user_id }).sort({ created_at: -1 });
};

// Energy logging
export const logEnergy = async (user_id, energy_level, notes = '') => {
  const energyLog = new EnergyLog({
    user_id,
    energy_level,
    notes
  });
  
  await energyLog.save();
  return energyLog;
};

export const getRecentEnergyLogs = async (user_id, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await EnergyLog.find({
    user_id,
    created_at: { $gte: startDate }
  }).sort({ created_at: -1 });
};

// Detect drop-off risk
export const checkDropoffRisk = async (user_id) => {
  const recentProgress = await getRecentProgress(user_id, 2);
  const recentEnergy = await getRecentEnergyLogs(user_id, 14);
  
  const workoutCompletions = recentProgress.flatMap(p => p.daily_logs?.map(log => log.workout_completion) || []);
  const dietAdherences = recentProgress.flatMap(p => p.daily_logs?.map(log => log.diet_adherence) || []);
  
  const lastLogDate = recentProgress[0]?.created_at;
  
  return detectDropoffRisk(workoutCompletions, dietAdherences.map(d => calculateAdherence([d])), lastLogDate);
};

// Forecast goal achievement
export const forecastGoalAchievement = async (user_id) => {
  const allProgress = await getAllProgress(user_id);
  
  if (allProgress.length < 2) {
    return {
      estimated_weeks: null,
      confidence: 'Low - Need more data'
    };
  }
  
  // Calculate average weekly weight change
  const weights = allProgress.map(p => p.weight_kg).filter(Boolean);
  
  if (weights.length < 2) {
    return {
      estimated_weeks: null,
      confidence: 'Low - Need weight tracking data'
    };
  }
  
  const weeklyChanges = [];
  for (let i = 1; i < weights.length; i++) {
    weeklyChanges.push(weights[i] - weights[i - 1]);
  }
  
  const avgWeeklyChange = weeklyChanges.reduce((a, b) => a + b, 0) / weeklyChanges.length;
  
  // Get current profile to find target weight
  const lastProgress = allProgress[allProgress.length - 1];
  const currentWeight = lastProgress.weight_kg;
  
  // This would need profile data to get target weight - for now just return the calculation
  return {
    estimated_weeks: Math.abs(avgWeeklyChange) > 0 ? Math.ceil(Math.abs(5 / avgWeeklyChange)) : null,
    avg_weekly_change: Math.round(avgWeeklyChange * 10) / 10,
    confidence: 'Medium'
  };
};
