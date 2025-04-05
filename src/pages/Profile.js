import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  Progress,
  Badge,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Student',
  streak: 5,
  totalSessions: 12,
  subjects: ['Mathematics', 'Physics'],
  achievements: ['5 Day Streak', 'First Question', 'Helpful Answer'],
};

function Profile() {
  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        {/* Profile Header */}
        <Card>
          <CardBody>
            <HStack spacing={4}>
              <Avatar size="xl" name={mockUser.name} />
              <VStack align="start" spacing={1}>
                <Heading size="lg">{mockUser.name}</Heading>
                <Text color="gray.500">{mockUser.email}</Text>
                <Badge colorScheme="blue">{mockUser.role}</Badge>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Current Streak</StatLabel>
                <StatNumber>{mockUser.streak} days</StatNumber>
                <StatHelpText>Keep it up!</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Sessions</StatLabel>
                <StatNumber>{mockUser.totalSessions}</StatNumber>
                <StatHelpText>All-time learning</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Subjects</StatLabel>
                <StatNumber>{mockUser.subjects.length}</StatNumber>
                <StatHelpText>Active subjects</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Streak Progress */}
        <Card>
          <CardHeader>
            <Heading size="md">Weekly Progress</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <Progress
                value={70}
                size="lg"
                colorScheme="green"
                borderRadius="full"
              />
              <Text>You're on track! 5/7 days this week</Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <Heading size="md">Achievements</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {mockUser.achievements.map((achievement, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="blue.50"
                >
                  <Text fontWeight="bold">{achievement}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Subjects */}
        <Card>
          <CardHeader>
            <Heading size="md">Your Subjects</Heading>
          </CardHeader>
          <CardBody>
            <HStack spacing={2}>
              {mockUser.subjects.map((subject, index) => (
                <Badge key={index} colorScheme="purple" p={2}>
                  {subject}
                </Badge>
              ))}
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}

export default Profile; 