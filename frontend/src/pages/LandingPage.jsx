import React from 'react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 text-white">
        <h1 className="text-3xl font-bold">FitAI</h1>
        <div className="space-x-4">
          {token ? (
            <a href="/dashboard" className="bg-white text-blue-600 px-4 py-2 rounded font-bold">
              Dashboard
            </a>
          ) : (
            <>
              <a href="/login" className="hover:underline">Login</a>
              <a href="/register" className="bg-white text-blue-600 px-4 py-2 rounded font-bold">
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen text-white text-center px-4">
        <h2 className="text-6xl font-bold mb-4">Adaptive Fitness Intelligence</h2>
        <p className="text-xl mb-8 max-w-2xl">
          Get personalized workout plans, diet guidance, and an AI fitness coach that adapts to your progress in real-time.
        </p>
        
        {!token && (
          <div className="space-x-4">
            <a href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 inline-block">
              Get Started
            </a>
            <a href="/login" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 inline-block">
              Login
            </a>
          </div>
        )}
        
        {token && (
          <a href="/dashboard" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
            Go to Dashboard
          </a>
        )}
      </div>
      
      {/* Features Section */}
      <div className="bg-white text-gray-800 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12">Why Choose FitAI?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-2xl font-bold mb-3">📊 Smart Plans</h4>
              <p>
                Dynamic workout and diet plans generated specifically for your experience level, goals, and current fitness status.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-2xl font-bold mb-3">🤖 AI Coach</h4>
              <p>
                Get intelligent, personalized coaching advice based on your real progress data, not generic templates.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-2xl font-bold mb-3">📈 Real Adaptation</h4>
              <p>
                Your plans adjust automatically based on your adherence, fatigue levels, and progress trends.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-2xl font-bold mb-3">🎯 Goal Tracking</h4>
              <p>
                Track weight, measurements, habit scores, and get realistic timelines for achieving your fitness goals.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-2xl font-bold mb-3">⚠️ Risk Detection</h4>
              <p>
                Automatic detection of drop-off risk with personalized interventions to keep you motivated and on track.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h4 className="text-2xl font-bold mb-3">💪 Progressive Overload</h4>
              <p>
                Intelligent progression logic that increases intensity based on your actual performance and recovery.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 px-4 text-center">
        <h3 className="text-4xl font-bold mb-4">Start Your Transformation Today</h3>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of people achieving their fitness goals with AI-powered personalization.
        </p>
        <a href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
          Sign Up Free
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
