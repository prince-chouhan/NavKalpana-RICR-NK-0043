import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ChatbotWidget from './components/ChatbotWidget';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutPage from './pages/WorkoutPage';
import DietPage from './pages/DietPage';
import ProgressPage from './pages/ProgressPage';
import AssistantPage from './pages/AssistantPage';

const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatbotWidget />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile-setup" element={<ProtectedRoute element={<ProfileSetupPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/workouts" element={<ProtectedRoute element={<WorkoutPage />} />} />
          <Route path="/diet" element={<ProtectedRoute element={<DietPage />} />} />
          <Route path="/progress" element={<ProtectedRoute element={<ProgressPage />} />} />
          <Route path="/assistant" element={<ProtectedRoute element={<AssistantPage />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
