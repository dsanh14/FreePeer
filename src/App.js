import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import AIChat from './pages/AIChat';
import TutorMatch from './pages/TutorMatch';
import QnAForum from './pages/QnAForum';
import Profile from './pages/Profile';
import Login from './components/Login';
import Signup from './components/Signup';

// Protected Route component
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Public Route component (redirects to home if user is logged in)
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/home" /> : children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Box minH="100vh">
          <Navbar />
          <Box p={4}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
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
            </Routes>
          </Box>
        </Box>
      </AuthProvider>
    </Router>
  );
}

export default App; 