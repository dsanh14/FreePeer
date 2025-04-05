import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';

// Mock data for questions
const mockQuestions = [
  {
    id: 1,
    title: 'How to solve quadratic equations?',
    content: 'I need help understanding the quadratic formula and how to apply it.',
    subject: 'Mathematics',
    author: 'Student123',
    date: '2024-04-05',
    answers: [
      {
        id: 1,
        content: 'The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. Let me explain...',
        author: 'TutorPro',
        date: '2024-04-05',
      },
    ],
  },
  {
    id: 2,
    title: 'Understanding Newton\'s Laws',
    content: 'Can someone explain Newton\'s three laws of motion in simple terms?',
    subject: 'Physics',
    author: 'PhysicsLearner',
    date: '2024-04-04',
    answers: [],
  },
];

function QnAForum() {
  const [questions, setQuestions] = useState(mockQuestions);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });
  const answerBgColor = useColorModeValue('gray.50', 'gray.700');

  const handleSubmitQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;

    const question = {
      id: questions.length + 1,
      title: newQuestion.title,
      content: newQuestion.content,
      subject: 'General',
      author: 'CurrentUser',
      date: new Date().toISOString().split('T')[0],
      answers: [],
    };

    setQuestions([question, ...questions]);
    setNewQuestion({ title: '', content: '' });
  };

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Q&A Forum</Heading>

        {/* New Question Form */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <Input
                placeholder="Question Title"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Your question..."
                value={newQuestion.content}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, content: e.target.value })
                }
              />
              <Button
                colorScheme="blue"
                onClick={handleSubmitQuestion}
                alignSelf="flex-end"
              >
                Post Question
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Questions List */}
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <VStack align="stretch">
                <Heading size="md">{question.title}</Heading>
                <HStack>
                  <Badge colorScheme="blue">{question.subject}</Badge>
                  <Text fontSize="sm" color="gray.500">
                    by {question.author} on {question.date}
                  </Text>
                </HStack>
              </VStack>
            </CardHeader>
            <CardBody>
              <Text>{question.content}</Text>
            </CardBody>
            <CardFooter>
              <VStack align="stretch" w="100%">
                <Heading size="sm">Answers ({question.answers.length})</Heading>
                {question.answers.map((answer) => (
                  <Box
                    key={answer.id}
                    p={4}
                    bg={answerBgColor}
                    borderRadius="md"
                    mt={2}
                  >
                    <Text>{answer.content}</Text>
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      by {answer.author} on {answer.date}
                    </Text>
                  </Box>
                ))}
                <Button
                  variant="outline"
                  colorScheme="blue"
                  mt={4}
                  onClick={() => {
                    // TODO: Implement answer submission
                    alert('Answer submission coming soon!');
                  }}
                >
                  Add Answer
                </Button>
              </VStack>
            </CardFooter>
          </Card>
        ))}
      </VStack>
    </Box>
  );
}

export default QnAForum; 