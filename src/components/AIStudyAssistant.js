import React, { useState } from 'react';

export default function AIStudyAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI study assistant. How can I help you today?',
      sender: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: 'I\'m processing your question. This is a simulated response.',
        sender: 'assistant'
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            AI Study Assistant
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Get instant help with your study questions
          </p>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 