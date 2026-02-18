import * as workoutService from '../services/workoutService.js';

export const generateWorkoutPlan = async (req, res) => {
  try {
    const { week_number } = req.body;
    const workoutPlan = await workoutService.generateWorkoutPlan(req.user_id, week_number || 1);
    res.status(201).json(workoutPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getLatestWorkout = async (req, res) => {
  try {
    const workoutPlan = await workoutService.getLatestWorkoutPlan(req.user_id);
    res.status(200).json(workoutPlan);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getWorkoutByWeek = async (req, res) => {
  try {
    const { week_number } = req.params;
    const workoutPlan = await workoutService.getWorkoutPlanByWeek(req.user_id, parseInt(week_number));
    res.status(200).json(workoutPlan);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllWorkouts = async (req, res) => {
  try {
    const workoutPlans = await workoutService.getAllWorkoutPlans(req.user_id);
    res.status(200).json(workoutPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
