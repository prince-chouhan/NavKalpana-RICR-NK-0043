import express from 'express';
import * as progressController from '../controllers/progressController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All progress routes require authentication
router.use(authMiddleware);

// Progress logging
router.post('/', progressController.logProgress);
router.get('/week/:week_number', progressController.getProgressByWeek);
router.get('/recent', progressController.getRecentProgress);
router.get('/', progressController.getAllProgress);

// Habit scores
router.get('/habits/current', progressController.getCurrentHabitScore);
router.get('/habits', progressController.getHabitScores);

// Energy logging
router.post('/energy', progressController.logEnergy);
router.get('/energy/recent', progressController.getRecentEnergyLogs);

// Body measurements
router.post('/measurements', progressController.logMeasurements);
router.get('/measurements/latest', progressController.getLatestMeasurements);
router.get('/measurements', progressController.getAllMeasurements);

// Risk detection
router.get('/dropoff/check', progressController.checkDropoffRisk);

// Goal forecasting
router.get('/forecast/goal', progressController.forecastGoal);

export default router;
