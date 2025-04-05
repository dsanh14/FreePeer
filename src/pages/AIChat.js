import React, { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useColorModeValue,
  Flex,
  Avatar,
} from '@chakra-ui/react';

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    // TODO: Integrate with OpenAI API
    // For now, we'll just echo the message
    const aiResponse = {
      text: `I'm your AI tutor. I received your message: "${input}"`,
      sender: 'ai',
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Box maxW="container.md" mx="auto" p={4}>
      <VStack spacing={4} align="stretch" h="80vh">
        <Box
          flex="1"
          overflowY="auto"
          p={4}
          bg={useColorModeValue('gray.50', 'gray.700')}
          borderRadius="lg"
        >
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
              mb={4}
            >
              <Box
                maxW="70%"
                bg={message.sender === 'user' ? 'blue.500' : 'gray.200'}
                color={message.sender === 'user' ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
              >
                <Text>{message.text}</Text>
              </Box>
            </Flex>
          ))}
        </Box>

        <Flex>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question..."
            mr={2}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button colorScheme="blue" onClick={handleSend}>
            Send
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}

export default AIChat; 