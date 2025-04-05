import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AIChat from './pages/AIChat';
import TutorMatch from './pages/TutorMatch';
import QnAForum from './pages/QnAForum';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Box minH="100vh">
        <Navbar />
        <Box p={4}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/tutor-match" element={<TutorMatch />} />
            <Route path="/qna-forum" element={<QnAForum />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App; 