import mongoose from 'mongoose';

const energyLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  energy_level: {
    type: String,
    enum: ['Energized', 'Normal', 'Slightly Fatigued', 'Very Tired'],
    required: true
  },
  notes: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('EnergyLog', energyLogSchema);
