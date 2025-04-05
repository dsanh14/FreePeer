import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaRobot, FaUsers, FaTrophy } from 'react-icons/fa';

function Landing() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const featureBg = useColorModeValue('white', 'gray.800');

  const features = [
    {
      icon: FaRobot,
      title: 'AI Study Buddy',
      description: 'Get instant help from our intelligent AI tutor, available 24/7 to answer your questions and explain concepts.',
    },
    {
      icon: FaUsers,
      title: 'Peer Tutoring',
      description: 'Connect with volunteer tutors in your subject area for personalized learning support.',
    },
    {
      icon: FaGraduationCap,
      title: 'Q&A Forum',
      description: 'Ask questions and get answers from both AI and human tutors in our community forum.',
    },
    {
      icon: FaTrophy,
      title: 'Progress Tracking',
      description: 'Track your learning progress, maintain streaks, and earn achievements as you learn.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
            <VStack align="start" spacing={6}>
              <Heading size="2xl" lineHeight="1.2">
                Your AI-Powered Learning Companion
              </Heading>
              <Text fontSize="xl" color="gray.600">
                StudyBuddy Connect combines AI assistance with peer tutoring to help you learn better, faster, and more effectively.
              </Text>
              <HStack spacing={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </HStack>
            </VStack>
            <Box>
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Students learning"
                borderRadius="lg"
                shadow="xl"
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading>Why Choose StudyBuddy Connect?</Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                Our platform combines the best of AI technology and human expertise to create a comprehensive learning experience.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  p={6}
                  bg={featureBg}
                  borderRadius="lg"
                  shadow="md"
                  _hover={{ shadow: 'lg', transform: 'translateY(-5px)' }}
                  transition="all 0.3s"
                >
                  <VStack spacing={4} align="start">
                    <Icon as={feature.icon} w={8} h={8} color="blue.500" />
                    <Heading size="md">{feature.title}</Heading>
                    <Text color="gray.600">{feature.description}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="blue.600" color="white" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading>Ready to Start Learning?</Heading>
            <Text fontSize="xl" maxW="2xl">
              Join thousands of students who are already improving their grades with StudyBuddy Connect.
            </Text>
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              onClick={() => navigate('/signup')}
            >
              Create Your Account
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing; 