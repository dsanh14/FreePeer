import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export default function AIStudyAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI study assistant powered by Gemini. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chat, setChat] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading]);

  const initializeChat = useCallback(async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const newChat = model.startChat({
        history: [
          {
            role: "user",
            parts: "You are a helpful study assistant. Your goal is to help students understand concepts, solve problems, and improve their learning. Be clear, concise, and encouraging. If a student asks about a specific subject, focus on explaining concepts in that subject area. Always maintain a supportive and educational tone."
          },
          {
            role: "model",
            parts: "I understand. I'll help students learn by explaining concepts clearly, providing step-by-step solutions, and offering encouragement. I'll focus on the specific subjects they're studying and maintain a supportive, educational approach to help them succeed."
          }
        ],
      });
      setChat(newChat);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setError('Failed to initialize chat. Please refresh the page.');
    }
  }, []);

  useEffect(() => {
    try {
      initializeChat();
    } catch (err) {
      console.error('Chat initialization error:', err);
      setError('Failed to initialize chat. Please refresh the page.');
    }
    return () => {
      setChat(null);
    };
  }, [selectedSubject, initializeChat]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chat) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom renderer for code blocks
  const CodeBlock = ({ language, value }) => {
    return (
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        PreTag="div"
        className="rounded-md my-2"
      >
        {value}
      </SyntaxHighlighter>
    );
  };

  const MarkdownComponents = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <CodeBlock
          language={match[1]}
          value={String(children).replace(/\n$/, '')}
        />
      ) : (
        <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
          {children}
        </code>
      );
    },
    p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-2">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 bg-gray-100 font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 border-t">
        {children}
      </td>
    ),
    a: ({ children, href }) => (
      <a href={href} className="text-blue-500 hover:text-blue-600 underline">
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic">
        {children}
      </em>
    ),
    hr: () => <hr className="my-4 border-t border-gray-200" />,
    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-2" />
    )
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-[#F8FAFC] flex">
      {/* Subject Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            StudyBuddy Connect AI Assistant
            <span className="ml-2 text-sm font-normal text-gray-500 flex items-center">
              <span className="text-lg mr-1">
                {subjects.find(s => s.id === selectedSubject).icon}
              </span>
              {subjects.find(s => s.id === selectedSubject).name}
            </span>
          </h1>
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Chat Area with rich text support */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ maxHeight: 'calc(100vh - 15rem)' }}>
          {messages.map((message, index) => (
            <div
              key={`message-${index}`}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={MarkdownComponents}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-xl px-4 py-2 bg-gray-50 text-gray-900">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
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
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition-colors`}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

      {/* Tips Panel */}
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
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