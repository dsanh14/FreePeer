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
  const [selectedSubject, setSelectedSubject] = useState('general');

  const subjects = [
    { id: 'general', name: 'General', icon: '📚' },
    { id: 'math', name: 'Mathematics', icon: '🔢' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'english', name: 'English', icon: '📝' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'cs', name: 'Computer Science', icon: '💻' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology', icon: '🧬' },
    { id: 'languages', name: 'Languages', icon: '🌎' }
  ];

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
        text: `I'll help you with your ${subjects.find(s => s.id === selectedSubject).name} question. This is a simulated response.`,
        sender: 'assistant'
      }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-5rem)] bg-[#F8FAFC] flex">
      {/* Subject Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Subjects</h2>
          <p className="text-sm text-gray-600">Select a subject to get specialized help</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 ${
                selectedSubject === subject.id
                  ? 'bg-blue-50 text-[#3B82F6]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-xl mr-3">{subject.icon}</span>
              {subject.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            AI Study Assistant
            <span className="ml-2 text-sm font-normal text-gray-500 flex items-center">
              <span className="text-lg mr-1">
                {subjects.find(s => s.id === selectedSubject).icon}
              </span>
              {subjects.find(s => s.id === selectedSubject).name}
            </span>
          </h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2 ${
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

        {/* Input Area */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask a question about ${subjects.find(s => s.id === selectedSubject).name.toLowerCase()}...`}
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            />
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Tips Panel */}
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tips</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">📝</span>
              <span>Be specific with your questions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🎯</span>
              <span>Include relevant context and examples</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💡</span>
              <span>Ask follow-up questions for clarity</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔍</span>
              <span>Use proper terminology for better results</span>
            </li>
          </ul>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Current Subject</h3>
            <div className="flex items-center text-blue-600">
              <span className="text-xl mr-2">
                {subjects.find(s => s.id === selectedSubject).icon}
              </span>
              <span>{subjects.find(s => s.id === selectedSubject).name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 