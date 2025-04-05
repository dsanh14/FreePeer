import React from 'react';
import { Box, Heading, Text, SimpleGrid, Button, VStack, Container } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Welcome to StudyBuddy Connect
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Your AI-powered learning companion and peer tutoring platform
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <VStack spacing={4}>
              <Heading size="md">AI Study Buddy</Heading>
              <Text>Get instant help from our AI tutor</Text>
              <Button as={RouterLink} to="/ai-chat" colorScheme="blue">
                Start Chat
              </Button>
            </VStack>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <VStack spacing={4}>
              <Heading size="md">Find a Tutor</Heading>
              <Text>Connect with peer tutors in your subject</Text>
              <Button as={RouterLink} to="/tutor-match" colorScheme="green">
                Browse Tutors
              </Button>
            </VStack>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <VStack spacing={4}>
              <Heading size="md">Q&A Forum</Heading>
              <Text>Ask questions and get help from the community</Text>
              <Button as={RouterLink} to="/qna-forum" colorScheme="purple">
                Visit Forum
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

export default Home; 