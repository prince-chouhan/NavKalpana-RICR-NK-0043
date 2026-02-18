import React, { useState, useEffect } from 'react';
import { profileService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight_kg: '',
    height_cm: '',
    goal: '',
    target_weight_kg: '',
    experience_level: '',
    available_days_per_week: '',
    dietary_preferences: '',
    allergies: '',
    injuries_limitations: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await profileService.getProfile();
      setProfile(res.data);
      setFormData({
        age: res.data.age,
        gender: res.data.gender,
        weight_kg: res.data.weight_kg,
        height_cm: res.data.height_cm,
        goal: res.data.goal,
        target_weight_kg: res.data.target_weight_kg,
        experience_level: res.data.experience_level,
        available_days_per_week: res.data.available_days_per_week,
        dietary_preferences: res.data.dietary_preferences || '',
        allergies: res.data.allergies || '',
        injuries_limitations: res.data.injuries_limitations || ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await profileService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) return (
    <div className="page-container bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-gray-800">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">👤 My Profile</h1>
            <p className="text-gray-600">Manage your fitness profile</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-neutral"
            >
              🏠 Back to Dashboard
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="btn-danger"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {error && <div className="card bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 animate-slide-down">{error}</div>}
        {success && <div className="card bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 animate-slide-down">{success}</div>}

        <div className="card p-8 animate-scale-in">{!editing ? (
            // View Mode
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary"
                >
                  ✏️ Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                  <p className="text-gray-900">{profile.age} years</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                  <p className="text-gray-900">{profile.gender}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Current Weight</label>
                  <p className="text-gray-900">{profile.weight_kg} kg</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Height</label>
                  <p className="text-gray-900">{profile.height_cm} cm</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Goal</label>
                  <p className="text-gray-900">{profile.goal}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Target Weight</label>
                  <p className="text-gray-900">{profile.target_weight_kg} kg</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Experience Level</label>
                  <p className="text-gray-900">{profile.experience_level}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Available Days/Week</label>
                  <p className="text-gray-900">{profile.available_days_per_week} days</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Daily Calorie Target</label>
                  <p className="text-gray-900">{profile.daily_calorie_target} kcal</p>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Dietary Preferences</label>
                  <p className="text-gray-900">{profile.dietary_preferences || 'None'}</p>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Allergies</label>
                  <p className="text-gray-900">{profile.allergies || 'None'}</p>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Injuries/Limitations</label>
                  <p className="text-gray-900">{profile.injuries_limitations || 'None'}</p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-neutral"
                >
                  ❌ Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight_kg"
                    value={formData.weight_kg}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height_cm"
                    value={formData.height_cm}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="target_weight_kg"
                    value={formData.target_weight_kg}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Available Days/Week</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    name="available_days_per_week"
                    value={formData.available_days_per_week}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Dietary Preferences</label>
                  <input
                    type="text"
                    name="dietary_preferences"
                    value={formData.dietary_preferences}
                    onChange={handleChange}
                    placeholder="e.g., Vegetarian, Vegan, Keto"
                    className="input-field"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="e.g., Nuts, Dairy, Gluten"
                    className="input-field"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Injuries/Limitations</label>
                  <textarea
                    name="injuries_limitations"
                    value={formData.injuries_limitations}
                    onChange={handleChange}
                    placeholder="e.g., Lower back pain, Knee injury"
                    className="input-field"
                    rows="3"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="btn-primary w-full text-lg"
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
