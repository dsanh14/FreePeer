import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import FindTutors from './components/FindTutors';
import StudyResources from './components/StudyResources';
import QAForum from './components/QAForum';
import AIStudyAssistant from './components/AIStudyAssistant';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import Onboarding from './components/Onboarding';
import About from './components/About';
import SeedTutors from './components/SeedTutors';
import Unauthorized from './components/Unauthorized';
import FindTutor from './components/FindTutor';
import ScheduledSessions from './components/ScheduledSessions';
import Conference from './components/Conference';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute roles={['student', 'tutor']}>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/find-tutors"
            element={
              <PrivateRoute>
                <Layout>
                  <FindTutor />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/study-resources"
            element={
              <PrivateRoute roles={['student', 'tutor']}>
                <Layout>
                  <StudyResources />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/qa-forum"
            element={
              <PrivateRoute roles={['student', 'tutor']}>
                <Layout>
                  <QAForum />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-study-assistant"
            element={
              <PrivateRoute roles={['student', 'tutor']}>
                <Layout>
                  <AIStudyAssistant />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute roles={['student', 'tutor']}>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute roles={['student', 'tutor']}>
                <Layout>
                  <Leaderboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <Layout>
                  <Onboarding />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route 
            path="/seed-tutors" 
            element={
              <PrivateRoute requireAdmin={true}>
                <SeedTutors />
              </PrivateRoute>
            } 
          />
          <Route
            path="/sessions"
            element={
              <PrivateRoute>
                <Layout>
                  <ScheduledSessions />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/conference/:sessionId"
            element={
              <PrivateRoute>
                <Layout>
                  <Conference />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 