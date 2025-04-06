import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Landing from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import StudyResources from './components/StudyResources';
import Leaderboard from './components/Leaderboard';
import ScheduledSessions from './components/ScheduledSessions';
import Conference from './components/Conference';
import FindTutors from './components/FindTutors';
import AIStudyAssistant from './components/AIStudyAssistant';
import Games from './components/Games';
import TextRPG from './components/TextRPG';
import MatchingGame from './components/MatchingGame';
import TutorProfile from './components/TutorProfile';
import QAForum from './components/QAForum';

function AppRoutes() {
  const { currentUser, userData } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/study-resources" element={<StudyResources />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/scheduled-sessions" element={currentUser ? <ScheduledSessions /> : <Navigate to="/login" />} />
      <Route path="/conference/:sessionId" element={currentUser ? <Conference /> : <Navigate to="/login" />} />
      <Route path="/find-tutors" element={currentUser ? <FindTutors /> : <Navigate to="/login" />} />
      <Route path="/ai-study-assistant" element={currentUser ? <AIStudyAssistant /> : <Navigate to="/login" />} />
      <Route path="/qa-forum" element={currentUser ? <QAForum /> : <Navigate to="/login" />} />
      <Route path="/games" element={currentUser ? <Games /> : <Navigate to="/login" />} />
      <Route path="/games/text-rpg" element={currentUser ? <TextRPG /> : <Navigate to="/login" />} />
      <Route path="/games/matching" element={currentUser ? <MatchingGame /> : <Navigate to="/login" />} />
      <Route path="/tutor-profile" element={userData?.role === 'tutor' ? <TutorProfile /> : <Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 