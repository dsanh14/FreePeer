import React from 'react';
import { Box, Flex, Link, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Link as={RouterLink} to="/" fontSize="xl" fontWeight="bold">
            StudyBuddy Connect
          </Link>
        </Box>
        <Flex alignItems={'center'}>
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
          <Button colorScheme="blue" ml={4}>
            Sign In
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar; 