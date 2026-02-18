import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/auth/profile')
};

// Profile endpoints
export const profileService = {
  createProfile: (profileData) =>
    api.post('/profile', profileData),
  getProfile: () =>
    api.get('/profile'),
  updateProfile: (profileData) =>
    api.put('/profile', profileData)
};

// Workout endpoints
export const workoutService = {
  generateWorkout: (weekNumber = 1) =>
    api.post('/workouts', { week_number: weekNumber }),
  getLatestWorkout: () =>
    api.get('/workouts/latest'),
  getWorkoutByWeek: (weekNumber) =>
    api.get(`/workouts/week/${weekNumber}`),
  getAllWorkouts: () =>
    api.get('/workouts')
};

// Diet endpoints
export const dietService = {
  generateDiet: (weekNumber = 1) =>
    api.post('/diet', { week_number: weekNumber }),
  getLatestDiet: () =>
    api.get('/diet/latest'),
  getDietByWeek: (weekNumber) =>
    api.get(`/diet/week/${weekNumber}`),
  getAllDiets: () =>
    api.get('/diet')
};

// Progress endpoints
export const progressService = {
  logProgress: (weekNumber, weightKg, dailyLogs) =>
    api.post('/progress', { week_number: weekNumber, weight_kg: weightKg, daily_logs: dailyLogs }),
  getProgressByWeek: (weekNumber) =>
    api.get(`/progress/week/${weekNumber}`),
  getAllProgress: () =>
    api.get('/progress'),
  getRecentProgress: (weeks = 12) =>
    api.get(`/progress/recent?weeks=${weeks}`),
  getHabitScores: () =>
    api.get('/progress/habits'),
  getCurrentHabitScore: () =>
    api.get('/progress/habits/current'),
  logEnergy: (energyLevel, notes = '') =>
    api.post('/progress/energy', { energy_level: energyLevel, notes }),
  getRecentEnergyLogs: (days = 7) =>
    api.get(`/progress/energy/recent?days=${days}`),
  logMeasurements: (measurements, notes = '') =>
    api.post('/progress/measurements', { measurements, notes }),
  getLatestMeasurements: () =>
    api.get('/progress/measurements/latest'),
  getAllMeasurements: () =>
    api.get('/progress/measurements'),
  checkDropoffRisk: () =>
    api.get('/progress/dropoff/check'),
  forecastGoal: () =>
    api.get('/progress/forecast/goal')
};

// Assistant endpoints
export const assistantService = {
  askQuestion: (question) =>
    api.post('/assistant/ask', { question })
};

export default api;
