import React, { useState, useEffect } from 'react';
import { dietService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DietPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDiet();
  }, []);

  const fetchDiet = async () => {
    try {
      const res = await dietService.getLatestDiet();
      setDietPlan(res.data);
    } catch (err) {
      console.error('Error fetching diet:', err);
      setError('Failed to load diet plan');
    } finally {
      setLoading(false);
    }
  };

  const generateNewDiet = async () => {
    setGenerating(true);
    setError('');
    try {
      const nextWeek = dietPlan ? dietPlan.week_number + 1 : 1;
      const res = await dietService.generateDiet(nextWeek);
      setDietPlan(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate diet plan');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="page-container bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-subtle">⏳</div>
        <p className="text-2xl font-bold text-gray-800">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">🥗 Diet Plan</h1>
            <p className="text-gray-600">Your personalized nutrition program</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-neutral"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={generateNewDiet}
              disabled={generating}
              className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
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

        {!dietPlan ? (
          <div className="card p-12 text-center animate-scale-in">
            <div className="text-8xl mb-6 animate-bounce-subtle">🥗</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Diet Plan Yet</h2>
            <p className="text-gray-600 text-lg mb-8">Generate your first AI-powered nutrition plan tailored to your goals!</p>
            <button
              onClick={generateNewDiet}
              disabled={generating}
              className="btn-success text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? '⏳ Generating Your Plan...' : '✨ Generate Diet Plan'}
            </button>
          </div>
        ) : (
          <>
            {/* Week Summary - AI Generated */}
            {dietPlan.week_summary && (
              <div className="glass-effect bg-gradient-to-r from-green-500 to-teal-600 text-white p-8 mb-8 animate-slide-up">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">🎯</span>
                  <div>
                    <h2 className="text-3xl font-bold">Week {dietPlan.week_number} Nutrition Focus</h2>
                    <p className="text-green-100">Your dietary strategy this week</p>
                  </div>
                </div>
                <p className="text-xl leading-relaxed">{dietPlan.week_summary}</p>
              </div>
            )}
            
            {/* Daily Targets */}
            <div className="card p-8 mb-8 animate-scale-in">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-4xl">🎯</span>
                Daily Targets
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <p className="text-sm mb-2 opacity-90">Daily Calories</p>
                  <p className="text-5xl font-bold mb-1">{dietPlan.daily_calorie_target}</p>
                  <p className="text-sm opacity-75">kcal</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <p className="text-sm mb-2 opacity-90">Protein</p>
                  <p className="text-5xl font-bold mb-1">{dietPlan.protein_grams}</p>
                  <p className="text-sm opacity-75">g ({dietPlan.protein_percent}%)</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                  <p className="text-sm mb-2 opacity-90">Carbs</p>
                  <p className="text-5xl font-bold mb-1">{dietPlan.carbs_grams}</p>
                  <p className="text-sm opacity-75">g ({dietPlan.carbs_percent}%)</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <p className="text-sm mb-2 opacity-90">Fat</p>
                  <p className="text-5xl font-bold mb-1">{dietPlan.fat_grams}</p>
                  <p className="text-sm opacity-75">g ({dietPlan.fat_percent}%)</p>
                </div>
              </div>
            </div>
            
            {/* Meals */}
            <div className="space-y-6 mb-8">
              {dietPlan.meals.map((meal, idx) => (
                <div key={idx} className="card p-8 hover:shadow-xl transition-all animate-scale-in" style={{animationDelay: `${idx * 0.1}s`}}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-5xl">{['🌅', '☀️', '🌤️', '🌙'][idx] || '🍽️'}</span>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-800">
                            {meal.meal_name}
                          </h3>
                          {meal.time_suggestion && (
                            <span className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full inline-block mt-1">
                              ⏰ {meal.time_suggestion}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-lg mb-4 leading-relaxed">{meal.description}</p>
                      
                      {/* Ingredients */}
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                          <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="text-xl">🛒</span>
                            Ingredients
                          </p>
                          <ul className="grid grid-cols-2 gap-2">
                            {meal.ingredients.map((ingredient, i) => (
                              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Preparation Tips */}
                      {meal.preparation_tips && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-4">
                          <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="text-xl">👨‍🍳</span>
                            Prep Tips
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">{meal.preparation_tips}</p>
                        </div>
                      )}
                      
                      {/* Why This Meal - AI Generated */}
                      {meal.why_this_meal && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                          <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="text-xl">💡</span>
                            Why This Meal
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">{meal.why_this_meal}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                      <p className="text-5xl font-bold mb-1">{meal.estimated_calories}</p>
                      <p className="text-sm opacity-90 mb-4">calories</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                          <span className="text-sm font-semibold">Protein:</span>
                          <span className="font-bold text-lg">{meal.macros.protein_g}g</span>
                        </div>
                        <div className="flex justify-between items-center gap-4 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                          <span className="text-sm font-semibold">Carbs:</span>
                          <span className="font-bold text-lg">{meal.macros.carbs_g}g</span>
                        </div>
                        <div className="flex justify-between items-center gap-4 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                          <span className="text-sm font-semibold">Fat:</span>
                          <span className="font-bold text-lg">{meal.macros.fat_g}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI-Generated Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hydration Goal */}
              {dietPlan.hydration_goal && (
                <div className="card p-6 hover:shadow-xl transition-shadow animate-slide-up">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-3xl">💧</span>
                    Hydration
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{dietPlan.hydration_goal}</p>
                </div>
              )}

              {/* Supplement Suggestions */}
              {dietPlan.supplement_suggestions && (
                <div className="card p-6 hover:shadow-xl transition-shadow animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-3xl">💊</span>
                    Supplements
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{dietPlan.supplement_suggestions}</p>
                </div>
              )}

              {/* Meal Prep Tips */}
              {dietPlan.meal_prep_tips && (
                <div className="card p-6 hover:shadow-xl transition-shadow animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-3xl">📦</span>
                    Meal Prep
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{dietPlan.meal_prep_tips}</p>
                </div>
              )}
            </div>

            {/* Adjustment Notes */}
            {dietPlan.adjustment_notes && (
              <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 mt-8 animate-fade-in">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">⚙️</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-2">Adjustment Notes</p>
                    <p className="text-gray-700 leading-relaxed">{dietPlan.adjustment_notes}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DietPage;
