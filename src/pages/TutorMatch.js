import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Select,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';

// Mock data for tutors
const mockTutors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    subject: 'Mathematics',
    level: 'Advanced',
    availability: ['Mon 2-4pm', 'Wed 3-5pm', 'Fri 1-3pm'],
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Michael Chen',
    subject: 'Physics',
    level: 'Intermediate',
    availability: ['Tue 10am-12pm', 'Thu 2-4pm'],
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    subject: 'Chemistry',
    level: 'Beginner',
    availability: ['Mon 4-6pm', 'Wed 10am-12pm'],
    rating: 4.9,
  },
];

function TutorMatch() {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry'];

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg" mb={4}>
          Find a Tutor
        </Heading>

        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          maxW="300px"
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject === 'all' ? 'All Subjects' : subject}
            </option>
          ))}
        </Select>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {mockTutors
            .filter(
              (tutor) =>
                selectedSubject === 'all' || tutor.subject === selectedSubject
            )
            .map((tutor) => (
              <Card key={tutor.id}>
                <CardHeader>
                  <Heading size="md">{tutor.name}</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={2}>
                    <Text>
                      <strong>Subject:</strong> {tutor.subject}
                    </Text>
                    <Text>
                      <strong>Level:</strong> {tutor.level}
                    </Text>
                    <Text>
                      <strong>Rating:</strong> {tutor.rating} ⭐
                    </Text>
                    <Box>
                      <Text fontWeight="bold">Availability:</Text>
                      {tutor.availability.map((slot, index) => (
                        <Badge key={index} colorScheme="green" mr={2} mb={2}>
                          {slot}
                        </Badge>
                      ))}
                    </Box>
                  </VStack>
                </CardBody>
                <CardFooter>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      // TODO: Implement booking functionality
                      alert(`Booking session with ${tutor.name}`);
                    }}
                  >
                    Book Session
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default TutorMatch; 