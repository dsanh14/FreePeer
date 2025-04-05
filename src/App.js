import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AIHelp from './components/AIHelp';
import FindTutors from './components/FindTutors';
import TutorLogin from './components/TutorLogin';
import TutorDashboard from './components/TutorDashboard';
import TutorApplication from './components/TutorApplication';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="/tutor-login" element={<Layout><TutorLogin /></Layout>} />
          <Route path="/tutor-application" element={<Layout><TutorApplication /></Layout>} />
          <Route path="/unauthorized" element={<Layout><Unauthorized /></Layout>} />

          {/* Protected Student Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute roles={['student']}>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-help"
            element={
              <PrivateRoute roles={['student']}>
                <Layout>
                  <AIHelp />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/find-tutors"
            element={
              <PrivateRoute roles={['student']}>
                <Layout>
                  <FindTutors />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Protected Tutor Routes */}
          <Route
            path="/tutor-dashboard"
            element={
              <PrivateRoute roles={['tutor']}>
                <Layout>
                  <TutorDashboard />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 