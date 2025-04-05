import React from 'react';
import { Box, Flex, Link, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Link as={RouterLink} to="/" fontSize="xl" fontWeight="bold">
            StudyBuddy Connect
          </Link>
        </Box>
        <Flex alignItems={'center'}>
          {currentUser ? (
            <>
              <Link as={RouterLink} to="/ai-chat" mx={2}>
                AI Chat
              </Link>
              <Link as={RouterLink} to="/tutor-match" mx={2}>
                Find Tutor
              </Link>
              <Link as={RouterLink} to="/qna-forum" mx={2}>
                Q&A Forum
              </Link>
              <Link as={RouterLink} to="/profile" mx={2}>
                Profile
              </Link>
              <Button colorScheme="blue" ml={4} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                colorScheme="blue"
                variant="outline"
                mr={2}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar; 