import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const WorkoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkout();
  }, []);

  const fetchWorkout = async () => {
    try {
      const res = await workoutService.getLatestWorkout();
      setWorkoutPlan(res.data);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError('Failed to load workout plan');
    } finally {
      setLoading(false);
    }
  };

  const generateNewWorkout = async () => {
    setGenerating(true);
    setError('');
    try {
      const nextWeek = workoutPlan ? workoutPlan.week_number + 1 : 1;
      const res = await workoutService.generateWorkout(nextWeek);
      setWorkoutPlan(res.data);
      setSelectedDay(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate workout plan');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="page-container bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-gray-800">Loading...</p>
      </div>
    </div>
  );

  const currentDay = workoutPlan?.workouts[selectedDay];

  return (
    <div className="page-container bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">💪 Workout Plan</h1>
            <p className="text-gray-600">Your personalized training program</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-neutral"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={generateNewWorkout}
              disabled={generating}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? '⏳ Generating...' : '✨ Generate New Plan'}
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="btn-danger"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {error && <div className="card bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 animate-slide-down">⚠️ {error}</div>}

        {!workoutPlan ? (
          <div className="card p-12 text-center animate-scale-in">
            <div className="text-8xl mb-6 animate-bounce-subtle">💪</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Workout Plan Yet</h2>
            <p className="text-gray-600 text-lg mb-8">Generate your first AI-powered workout plan tailored to your goals!</p>
            <button
              onClick={generateNewWorkout}
              disabled={generating}
              className="btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? '⏳ Generating Your Plan...' : '✨ Generate Workout Plan'}
            </button>
          </div>
        ) : (
          <>
            {/* Week Summary - AI Generated */}
            {workoutPlan.week_summary && (
              <div className="glass-effect bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 mb-8 animate-slide-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">🎯</span>
                  <div>
                    <h2 className="text-3xl font-bold">Week {workoutPlan.week_number} Overview</h2>
                    <p className="text-blue-100">Your training focus this week</p>
                  </div>
                </div>
                <p className="text-xl leading-relaxed">{workoutPlan.week_summary}</p>
              </div>
            )}

            {/* Motivation Message - AI Generated */}
            {workoutPlan.motivation_message && (
              <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">💪</span>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">Motivation Boost</p>
                    <p className="text-gray-700 text-lg">{workoutPlan.motivation_message}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Day Selector */}
            <div className="card p-6 mb-8 animate-scale-in">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Select Training Day</h3>
              <div className="grid grid-cols-7 gap-3">
                {workoutPlan.workouts.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`p-5 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      selectedDay === idx
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-glow scale-105'
                        : day.rest_day
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'
                    }`}
                  >
                    <div className="text-xs mb-2 uppercase tracking-wide">{day.day_name.slice(0, 3)}</div>
                    <div className="text-3xl mb-1">{day.rest_day ? '🛌' : '💪'}</div>
                    <div className="text-xs opacity-75">Day {day.day}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Current Day Details */}
            {currentDay && (
              <div className="card p-8 mb-8 animate-fade-in">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-2">{currentDay.day_name}</h3>
                    <p className="text-2xl text-gray-600 flex items-center gap-2">
                      {currentDay.rest_day ? (
                        <>
                          <span className="text-3xl">🛌</span>
                          <span>Rest & Recovery Day</span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl">💪</span>
                          <span>{currentDay.type}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-right bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600">Day {currentDay.day}</div>
                    <div className="text-2xl font-bold text-blue-600">Week {workoutPlan.week_number}</div>
                  </div>
                </div>
                
                {currentDay.exercises.length > 0 ? (
                  <div className="space-y-6">
                    {currentDay.exercises.map((exercise, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-r-2xl hover:shadow-lg transition-all transform hover:-translate-y-1 animate-scale-in" style={{animationDelay: `${idx * 0.1}s`}}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                              {idx + 1}
                            </div>
                            <h4 className="text-2xl font-bold text-gray-800">{exercise.name}</h4>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                            exercise.intensity_level === 'High' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                            exercise.intensity_level === 'Moderate' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                            'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                          }`}>
                            {exercise.intensity_level}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl font-bold text-blue-600 mb-1">{exercise.sets}</div>
                            <div className="text-sm text-gray-600 font-semibold">Sets</div>
                          </div>
                          <div className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl font-bold text-purple-600 mb-1">{exercise.reps}</div>
                            <div className="text-sm text-gray-600 font-semibold">Reps</div>
                          </div>
                          <div className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl font-bold text-pink-600 mb-1">{exercise.rest_seconds}s</div>
                            <div className="text-sm text-gray-600 font-semibold">Rest</div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="text-xl">📝</span>
                            Form & Guidance
                          </p>
                          <p className="text-gray-700 leading-relaxed">{exercise.guidance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                    <p className="text-7xl mb-4 animate-bounce-subtle">🌟</p>
                    <p className="text-gray-800 text-2xl font-bold mb-2">Rest and recover today!</p>
                    <p className="text-gray-600 text-lg">Your body needs time to adapt and grow stronger.</p>
                  </div>
                )}
              </div>
            )}

            {/* AI-Generated Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progression Notes */}
              {workoutPlan.progression_notes && (
                <div className="card p-6 hover:shadow-xl transition-shadow animate-slide-up">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-3xl">📈</span>
                    Progression Strategy
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{workoutPlan.progression_notes}</p>
                </div>
              )}

              {/* Recovery Tips */}
              {workoutPlan.recovery_tips && (
                <div className="card p-6 hover:shadow-xl transition-shadow animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-3xl">💤</span>
                    Recovery Tips
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{workoutPlan.recovery_tips}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;
