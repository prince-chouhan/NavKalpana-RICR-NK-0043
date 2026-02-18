import React, { useState, useRef, useEffect } from 'react';
import { assistantService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AssistantPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'bot',
      message: 'Hi! I\'m your AI Fitness Coach. I have access to your complete fitness journey data and can provide personalized advice. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Fetch user stats to show AI has context
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [progressRes, habitsRes] = await Promise.all([
          assistantService.getRecentProgress?.(4) || Promise.resolve({ data: [] }),
          assistantService.getHabitScores?.(4) || Promise.resolve({ data: [] })
        ]).catch(() => [{ data: [] }, { data: [] }]);
        
        const progress = progressRes.data || [];
        const habits = habitsRes.data || [];
        
        if (progress.length > 0 || habits.length > 0) {
          const avgWorkout = progress.length > 0 
            ? Math.round(progress.reduce((sum, p) => sum + (p.workout_adherence_percent || 0), 0) / progress.length)
            : 0;
          const avgDiet = progress.length > 0
            ? Math.round(progress.reduce((sum, p) => sum + (p.diet_adherence_percent || 0), 0) / progress.length)
            : 0;
          const currentStreak = habits.length > 0 ? habits[habits.length - 1].streak_count : 0;
          
          setUserStats({
            weeksTracked: progress.length,
            avgWorkout,
            avgDiet,
            currentStreak
          });
        }
      } catch (err) {
        console.log('Could not fetch user stats:', err);
      }
    };
    
    fetchUserStats();
  }, []);

  const handleAsk = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      type: 'user',
      message: question,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);
    setError('');
    
    try {
      const res = await assistantService.askQuestion(question);
      
      // Add bot response to chat
      const botMessage = {
        type: 'bot',
        message: res.data.response,
        steps: res.data.steps,
        tip: res.data.tip,
        data_insights: res.data.data_insights,
        disclaimer: res.data.disclaimer,
        confidence: res.data.confidence,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get response');
      const errorMessage = {
        type: 'bot',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (q) => {
    setQuestion(q);
  };

  const suggestedQuestions = [
    'How am I doing with my fitness journey?',
    'Why am I not losing weight?',
    'Should I increase my protein intake?',
    'Am I working out too much or too little?',
    'What should I focus on this week?'
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">🤖 AI Fitness Coach</h1>
            <p className="text-blue-100">Get personalized advice based on your real data</p>
            {userStats && (
              <div className="mt-2 text-sm text-blue-100 flex gap-4">
                <span>📊 {userStats.weeksTracked} weeks tracked</span>
                <span>💪 {userStats.avgWorkout}% workout</span>
                <span>🥗 {userStats.avgDiet}% diet</span>
                <span>🔥 {userStats.currentStreak} week streak</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-4">
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${chat.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} rounded-lg p-4 shadow`}>
                {chat.type === 'bot' && (
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🤖</span>
                    <span className="font-bold text-sm">AI Coach</span>
                  </div>
                )}
                
                <p className="whitespace-pre-wrap">{chat.message}</p>
                
                {chat.steps && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="font-bold text-sm mb-2">📋 Action Steps:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {chat.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {chat.tip && (
                  <div className="mt-3 bg-blue-50 p-2 rounded text-sm">
                    <span className="font-bold">💡 Tip:</span> {chat.tip}
                  </div>
                )}
                
                {chat.data_insights && (
                  <div className="mt-3 bg-purple-50 p-2 rounded text-sm">
                    <span className="font-bold">📊 Data Insights:</span> {chat.data_insights}
                  </div>
                )}
                
                {chat.disclaimer && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ {chat.disclaimer}
                  </p>
                )}
                
                <p className="text-xs opacity-60 mt-2">
                  {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions */}
        {chatHistory.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2 font-semibold">💬 Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-sm px-3 py-2 bg-white hover:bg-blue-50 rounded-full border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleAsk} className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your fitness journey..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantPage;
