import BodyMeasurement from '../models/BodyMeasurement.js';

export const logBodyMeasurements = async (user_id, measurements, notes = '') => {
  const measurement = new BodyMeasurement({
    user_id,
    measurements,
    notes
  });
  
  await measurement.save();
  return measurement;
};

export const getLatestMeasurements = async (user_id) => {
  return await BodyMeasurement.findOne({ user_id }).sort({ created_at: -1 });
};

export const getAllMeasurements = async (user_id) => {
  return await BodyMeasurement.find({ user_id }).sort({ created_at: -1 });
};

export const getMeasurementsComparison = async (user_id, fromDate, toDate) => {
  const measurements = await BodyMeasurement.find({
    user_id,
    created_at: {
      $gte: fromDate,
      $lte: toDate
    }
  }).sort({ created_at: 1 });
  
  if (measurements.length < 2) {
    return {
      comparison: null,
      message: 'Need at least 2 measurements to compare'
    };
  }
  
  const first = measurements[0].measurements;
  const last = measurements[measurements.length - 1].measurements;
  
  const comparison = {};
  for (const [key, value] of Object.entries(first)) {
    if (last[key]) {
      comparison[key] = {
        start: value,
        end: last[key],
        change: last[key] - value
      };
    }
  }
  
  return { comparison, measurements };
};
