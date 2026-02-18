import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '../.env');
dotenv.config({ path: envPath });

import ProgressLog from '../models/ProgressLog.js';
import HabitScore from '../models/HabitScore.js';
import EnergyLog from '../models/EnergyLog.js';
import BodyMeasurement from '../models/BodyMeasurement.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

const addProgressForUser = async (user, profile) => {
  console.log(`\n📊 Adding progress data for: ${user.email}`);
  
  // Clear existing data
  await ProgressLog.deleteMany({ user_id: user._id });
  await HabitScore.deleteMany({ user_id: user._id });
  await EnergyLog.deleteMany({ user_id: user._id });
  await BodyMeasurement.deleteMany({ user_id: user._id });

  const startWeight = profile.weight_kg;
  const isWeightLoss = profile.goal === 'Weight Loss';
  const weeklyChange = isWeightLoss ? -0.5 : 0.3;

  for (let week = 1; week <= 8; week++) {
    const currentWeight = startWeight + (weeklyChange * week);
    const workoutAdherence = 70 + Math.random() * 25;
    const dietAdherence = 65 + Math.random() * 30;
    
    const dailyLogs = [];
    for (let day = 1; day <= 7; day++) {
      dailyLogs.push({
        day_number: day,
        workout_completed: Math.random() > 0.2,
        diet_followed: Math.random() > 0.25,
        notes: day === 7 ? 'Weekly review completed' : ''
      });
    }

    const progressLog = new ProgressLog({
      user_id: user._id,
      week_number: week,
      weight_kg: parseFloat(currentWeight.toFixed(1)),
      weight_change_kg: parseFloat((currentWeight - startWeight).toFixed(1)),
      workout_adherence_percent: Math.round(workoutAdherence),
      diet_adherence_percent: Math.round(dietAdherence),
      fatigue_level: ['Energized', 'Normal', 'Slightly Fatigued'][Math.floor(Math.random() * 3)],
      daily_logs: dailyLogs,
      notes: `Week ${week} completed successfully`
    });
    await progressLog.save();

    const habitScore = new HabitScore({
      user_id: user._id,
      week_number: week,
      habit_score: Math.round((workoutAdherence + dietAdherence) / 2),
      streak_count: week,
      drop_off_risk: workoutAdherence < 60 || dietAdherence < 60 ? 'High' : 'Low'
    });
    await habitScore.save();

    for (let day = 0; day < 7; day++) {
      const energyLog = new EnergyLog({
        user_id: user._id,
        energy_level: ['Energized', 'Normal', 'Slightly Fatigued', 'Very Tired'][Math.floor(Math.random() * 4)],
        date: new Date(Date.now() - (8 - week) * 7 * 24 * 60 * 60 * 1000 + day * 24 * 60 * 60 * 1000),
        notes: day === 0 ? 'Start of week' : ''
      });
      await energyLog.save();
    }

    if (week % 2 === 0) {
      const measurement = new BodyMeasurement({
        user_id: user._id,
        measurements: {
          chest_cm: 95 + Math.random() * 2,
          waist_cm: 85 - (week * 0.5),
          hips_cm: 100 - (week * 0.3),
          arms_cm: 32 + Math.random(),
          thighs_cm: 55 - (week * 0.2)
        },
        measured_at: new Date(Date.now() - (8 - week) * 7 * 24 * 60 * 60 * 1000),
        notes: `Week ${week} measurements`
      });
      await measurement.save();
    }

    console.log(`  ✅ Week ${week}: ${currentWeight.toFixed(1)}kg, Workout ${Math.round(workoutAdherence)}%, Diet ${Math.round(dietAdherence)}%`);
  }
};

const addProgressForAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitai');
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find();
    console.log(`Found ${users.length} users\n`);

    for (const user of users) {
      const profile = await Profile.findOne({ user_id: user._id });
      
      if (!profile) {
        console.log(`⚠️  Skipping ${user.email} - no profile found`);
        continue;
      }

      await addProgressForUser(user, profile);
    }

    console.log('\n🎉 Progress data added for all users!');
    console.log('\n💡 Now try the chatbot - it should reference your specific data!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

addProgressForAllUsers();
