import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AIHelp from './components/AIHelp';
import FindTutors from './components/FindTutors';
import PrivateRoute from './components/PrivateRoute';
import AIChat from './pages/AIChat';
import TutorMatch from './pages/TutorMatch';
import QnAForum from './pages/QnAForum';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-help"
              element={
                <PrivateRoute>
                  <AIHelp />
                </PrivateRoute>
              }
            />
            <Route
              path="/tutoring"
              element={
                <PrivateRoute>
                  <FindTutors />
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <PrivateRoute>
                  <AIChat />
                </PrivateRoute>
              }
            />
            <Route
              path="/tutor-match"
              element={
                <PrivateRoute>
                  <TutorMatch />
                </PrivateRoute>
              }
            />
            <Route
              path="/qna-forum"
              element={
                <PrivateRoute>
                  <QnAForum />
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App; 