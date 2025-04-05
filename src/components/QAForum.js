import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function QAForum() {
  const { user } = useAuth();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Questions', icon: '📚' },
    { id: 'math', name: 'Mathematics', icon: '🔢' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'english', name: 'English', icon: '📝' },
    { id: 'cs', name: 'Computer Science', icon: '💻' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
  ];

  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'How to solve quadratic equations?',
      content: 'I\'m having trouble understanding how to solve quadratic equations using the quadratic formula. Can someone explain it step by step?',
      author: 'John Doe',
      date: '2024-03-15',
      category: 'math',
      votes: 15,
      answers: [
        {
          id: 1,
          content: 'The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a. Let me break it down step by step...',
          author: 'Jane Smith',
          date: '2024-03-15'
        }
      ],
      solved: true
    },
    {
      id: 2,
      title: 'Best resources for learning Python?',
      content: 'I\'m new to programming and want to learn Python. What are the best resources for beginners?',
      author: 'Alice Johnson',
      date: '2024-03-14',
      category: 'cs',
      votes: 8,
      answers: [
        {
          id: 1,
          content: 'I recommend starting with Python.org\'s official tutorial and then moving to Codecademy\'s Python course.',
          author: 'Bob Wilson',
          date: '2024-03-14'
        }
      ],
      solved: false
    }
  ]);

  const filteredQuestions = questions.filter(question => 
    (selectedCategory === 'all' || question.category === selectedCategory) &&
    (searchQuery === '' || question.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowOverlay(true);
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const question = {
      id: questions.length + 1,
      title: newQuestion,
      content: newQuestion,
      author: user?.displayName || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      category: selectedCategory,
      votes: 0,
      answers: [],
      solved: false
    };

    setQuestions([question, ...questions]);
    setNewQuestion('');
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!newAnswer.trim() || !selectedQuestion) return;

    const answer = {
      id: selectedQuestion.answers.length + 1,
      content: newAnswer,
      author: user?.displayName || 'Anonymous',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedQuestions = questions.map(q => {
      if (q.id === selectedQuestion.id) {
        return {
          ...q,
          answers: [...q.answers, answer]
        };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    setSelectedQuestion(updatedQuestions.find(q => q.id === selectedQuestion.id));
    setNewAnswer('');
  };

  return (
    <div className="h-[calc(100vh-5rem)] bg-[#F8FAFC] flex">
      {/* Categories Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Categories</h2>
          <p className="text-sm text-gray-600">Browse questions by subject</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 ${
                selectedCategory === category.id
                  ? 'bg-blue-50 text-[#3B82F6]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-xl mr-3">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              Q&A Forum
              <span className="ml-2 text-sm font-normal text-gray-500 flex items-center">
                <span className="text-lg mr-1">
                  {categories.find(c => c.id === selectedCategory).icon}
                </span>
                {categories.find(c => c.id === selectedCategory).name}
              </span>
            </h1>
            <button className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Ask Question
            </button>
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                onClick={() => handleQuestionClick(question)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {categories.find(c => c.id === question.category).icon}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {question.title}
                      </h3>
                      {question.solved && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Solved
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>by {question.author}</span>
                      <span>•</span>
                      <span>{question.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span>👍</span>
                      <span>{question.votes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span>💬</span>
                      <span>{question.answers.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Stats</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Your Activity</h3>
              <div className="space-y-2 text-sm text-blue-600">
                <div className="flex justify-between">
                  <span>Questions Asked</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between">
                  <span>Answers Given</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between">
                  <span>Helpful Votes</span>
                  <span>28</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Top Contributors</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Sarah M.</span>
                  <span>152 pts</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>John D.</span>
                  <span>98 pts</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Mike R.</span>
                  <span>87 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Overlay */}
      {showOverlay && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">{selectedQuestion.title}</h2>
                <button
                  onClick={() => setShowOverlay(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-4">{selectedQuestion.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                <span>By {selectedQuestion.author}</span>
                <span>{selectedQuestion.date}</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Answers Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedQuestion.answers.length} {selectedQuestion.answers.length === 1 ? 'Answer' : 'Answers'}
                </h3>
                {selectedQuestion.answers.map((answer) => (
                  <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 mb-2">{answer.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {answer.author}</span>
                      <span>{answer.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Bottom Form */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <div>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer..."
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Post Answer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 