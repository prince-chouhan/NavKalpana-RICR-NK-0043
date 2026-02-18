import * as profileService from '../services/profileService.js';

export const createProfile = async (req, res) => {
  try {
    const { age, biological_sex, height_cm, weight_kg, activity_level, experience_level, goal, target_weight_kg } = req.body;
    
    // Validate required fields
    if (!age || !biological_sex || !height_cm || !weight_kg || !activity_level || !experience_level || !goal || !target_weight_kg) {
      return res.status(400).json({ error: 'All profile fields are required' });
    }
    
    const profile = await profileService.createProfile(req.user_id, {
      age,
      biological_sex,
      height_cm,
      weight_kg,
      activity_level,
      experience_level,
      goal,
      target_weight_kg
    });
    
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.user_id);
    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await profileService.updateProfile(req.user_id, req.body);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
