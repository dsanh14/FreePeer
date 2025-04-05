import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Box minH="100vh">
          <Navbar />
          <Box p={4}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
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