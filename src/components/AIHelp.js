import React, { useState } from 'react';

export default function AIHelp() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Welcome to AI Study Assistant! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('general');
  const [isTyping, setIsTyping] = useState(false);

  const subjects = [
    { id: 'general', name: 'General', icon: '📚' },
    { id: 'math', name: 'Mathematics', icon: '🔢' },
    { id: 'science', name: 'Science', icon: '🧬' },
    { id: 'english', name: 'English', icon: '📝' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'cs', name: 'Computer Science', icon: '💻' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant',
        content: 'This is a placeholder response. In the actual implementation, this would be replaced with the AI response from the OpenAI API.'
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Study Assistant</h1>
        <p className="mt-2 text-gray-600">
          Get instant help with your homework and study materials. Choose a subject and ask any question!
        </p>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Subject Selection Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Subject</h2>
          <div className="space-y-2">
            {subjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setSubject(subj.id)}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  subject === subj.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <span className="text-xl transition-transform duration-200 transform group-hover:scale-110">
                  {subj.icon}
                </span>
                <span>{subj.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 transition-colors duration-200 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white hover:bg-primary-500'
                      : 'bg-gray-100 text-gray-900 hover:bg-primary-50'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 text-gray-900">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your question here..."
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 