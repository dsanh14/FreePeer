import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import FindTutors from './components/FindTutors';
import AIStudyAssistant from './components/AIStudyAssistant';
import QAForum from './components/QAForum';
import StudyResources from './components/StudyResources';
import Leaderboard from './components/Leaderboard';
import ScheduledSessions from './components/ScheduledSessions';
import Conference from './components/Conference';
import Profile from './components/Profile';
import TutorProfile from './components/TutorProfile';
import TutorOnboarding from './components/TutorOnboarding';
import Games from './components/Games';
import TextRPG from './components/TextRPG';
import MatchingGame from './components/MatchingGame';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/find-tutors"
                element={
                  <PrivateRoute>
                    <FindTutors />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ai-study-assistant"
                element={
                  <PrivateRoute>
                    <AIStudyAssistant />
                  </PrivateRoute>
                }
              />
              <Route
                path="/qa-forum"
                element={
                  <PrivateRoute>
                    <QAForum />
                  </PrivateRoute>
                }
              />
              <Route
                path="/study-resources"
                element={
                  <PrivateRoute>
                    <StudyResources />
                  </PrivateRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <PrivateRoute>
                    <Leaderboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/scheduled-sessions"
                element={
                  <PrivateRoute>
                    <ScheduledSessions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/conference/:sessionId"
                element={
                  <PrivateRoute>
                    <Conference />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tutor-profile"
                element={
                  <PrivateRoute>
                    <TutorProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tutor-onboarding"
                element={
                  <PrivateRoute>
                    <TutorOnboarding />
                  </PrivateRoute>
                }
              />
              <Route path="/games" element={<Games />} />
              <Route path="/games/text-rpg" element={<TextRPG />} />
              <Route path="/games/matching" element={<MatchingGame />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 