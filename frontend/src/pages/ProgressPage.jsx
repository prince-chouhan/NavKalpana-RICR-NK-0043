import React, { useState, useEffect } from 'react';
import { progressService } from '../services/apiService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProgressPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [progress, setProgress] = useState([]);
  const [habitScores, setHabitScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('weight');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, habitsRes] = await Promise.all([
          progressService.getRecentProgress(12),
          progressService.getHabitScores()
        ]);
        
        setProgress(progressRes.data.reverse());
        setHabitScores(habitsRes.data.reverse());
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="page-container bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-gray-800">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">📊 Your Progress</h1>
            <p className="text-gray-600">Track your fitness journey</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-neutral"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="btn-danger"
            >
              🚪 Logout
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 animate-scale-in">
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'weight'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow'
                : 'bg-white text-gray-800 hover:shadow-lg'
            }`}
          >
            <span className="text-2xl mr-2">⚖️</span>
            Weight Progress
          </button>
          <button
            onClick={() => setActiveTab('adherence')}
            className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'adherence'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-glow'
                : 'bg-white text-gray-800 hover:shadow-lg'
            }`}
          >
            <span className="text-2xl mr-2">✅</span>
            Adherence
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
              activeTab === 'habits'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-glow'
                : 'bg-white text-gray-800 hover:shadow-lg'
            }`}
          >
            <span className="text-2xl mr-2">🎯</span>
            Habit Scores
          </button>
        </div>
        
        {/* Weight Progress Chart */}
        {activeTab === 'weight' && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-4xl">📈</span>
              Weight Trend
            </h2>
            {progress.length > 0 ? (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="week_number" 
                      label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight_kg" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      name="Weight (kg)"
                      dot={{ fill: '#3b82f6', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">📊</p>
                <p className="text-gray-800 text-2xl font-bold mb-2">No progress data yet</p>
                <p className="text-gray-600 text-lg">Start logging your weekly progress to see your weight trend</p>
              </div>
            )}
          </div>
        )}
        
        {/* Adherence Chart */}
        {activeTab === 'adherence' && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-4xl">✅</span>
              Weekly Adherence
            </h2>
            {progress.length > 0 ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="week_number" 
                      label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      label={{ value: 'Adherence (%)', angle: -90, position: 'insideLeft' }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="workout_adherence_percent" fill="#3b82f6" name="Workout %" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="diet_adherence_percent" fill="#10b981" name="Diet %" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">✅</p>
                <p className="text-gray-800 text-2xl font-bold mb-2">No adherence data yet</p>
                <p className="text-gray-600 text-lg">Track your workout and diet adherence weekly to see your consistency</p>
              </div>
            )}
          </div>
        )}
        
        {/* Habit Scores Chart */}
        {activeTab === 'habits' && (
          <div className="card p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-4xl">🎯</span>
              Habit Score Trend
            </h2>
            {habitScores.length > 0 ? (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={habitScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="week_number" 
                      label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: 'Habit Score', angle: -90, position: 'insideLeft' }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="habit_score" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      name="Habit Score"
                      dot={{ fill: '#8b5cf6', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <p className="text-7xl mb-4 animate-bounce-subtle">🎯</p>
                <p className="text-gray-800 text-2xl font-bold mb-2">No habit scores yet</p>
                <p className="text-gray-600 text-lg">Your habit scores are calculated based on your weekly adherence</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
