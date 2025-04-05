import React, { useState } from 'react';

export default function QAForum() {
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

  // Sample questions data
  const questions = [
    {
      id: 1,
      title: 'How do I solve quadratic equations?',
      category: 'math',
      author: 'John D.',
      votes: 15,
      answers: 3,
      timestamp: '2h ago',
      solved: true
    },
    {
      id: 2,
      title: 'What is the difference between Java and JavaScript?',
      category: 'cs',
      author: 'Sarah M.',
      votes: 8,
      answers: 2,
      timestamp: '4h ago',
      solved: false
    },
    {
      id: 3,
      title: 'Can someone explain Newton\'s Third Law?',
      category: 'physics',
      author: 'Mike R.',
      votes: 12,
      answers: 4,
      timestamp: '1d ago',
      solved: true
    },
  ];

  const filteredQuestions = questions.filter(question => 
    (selectedCategory === 'all' || question.category === selectedCategory) &&
    (searchQuery === '' || question.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                      <span>{question.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span>👍</span>
                      <span>{question.votes}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span>💬</span>
                      <span>{question.answers}</span>
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
    </div>
  );
} 