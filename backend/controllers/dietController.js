import * as dietService from '../services/dietService.js';

export const generateDietPlan = async (req, res) => {
  try {
    const { week_number } = req.body;
    const dietPlan = await dietService.generateDietPlanForUser(req.user_id, week_number || 1);
    res.status(201).json(dietPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getLatestDiet = async (req, res) => {
  try {
    const dietPlan = await dietService.getLatestDietPlan(req.user_id);
    res.status(200).json(dietPlan);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getDietByWeek = async (req, res) => {
  try {
    const { week_number } = req.params;
    const dietPlan = await dietService.getDietPlanByWeek(req.user_id, parseInt(week_number));
    res.status(200).json(dietPlan);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllDiets = async (req, res) => {
  try {
    const dietPlans = await dietService.getAllDietPlans(req.user_id);
    res.status(200).json(dietPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
