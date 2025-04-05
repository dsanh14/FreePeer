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
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Study Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Get instant help with your study questions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-[600px] overflow-y-auto p-8 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-6 py-4 ${
                    message.sender === 'user'
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-gray-50 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 p-6 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
              />
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-6 border border-transparent rounded-lg text-base font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tips for Better Results</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="mr-2">📝</span>
              Be specific with your questions
            </li>
            <li className="flex items-center">
              <span className="mr-2">🎯</span>
              Include relevant context
            </li>
            <li className="flex items-center">
              <span className="mr-2">💡</span>
              Ask follow-up questions for clarity
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 