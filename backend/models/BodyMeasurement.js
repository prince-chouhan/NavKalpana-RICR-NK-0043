import mongoose from 'mongoose';

const bodyMeasurementSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  measurements: {
    waist_cm: Number,
    chest_cm: Number,
    hips_cm: Number,
    left_arm_cm: Number,
    right_arm_cm: Number,
    left_thigh_cm: Number,
    right_thigh_cm: Number
  },
  notes: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('BodyMeasurement', bodyMeasurementSchema);
