import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Mock data for questions
const mockQuestions = [
  {
    id: 1,
    title: 'How to solve quadratic equations?',
    content: 'I need help understanding the quadratic formula and how to apply it. Can someone explain it step by step?',
    subject: 'Mathematics',
    author: 'Sarah M.',
    date: '2024-04-05',
    answers: [
      {
        id: 1,
        content: 'The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. Let me break it down step by step:\n\n1. Identify a, b, and c from your equation (ax² + bx + c = 0)\n2. Plug these values into the formula\n3. Calculate the discriminant (b²-4ac)\n4. Use the ± symbol to find both solutions\n5. Simplify your answers',
        author: 'John D.',
        date: '2024-04-05',
        helpfulVotes: 12
      }
    ]
  },
  {
    id: 2,
    title: 'Understanding Newton\'s Laws',
    content: 'Can someone explain Newton\'s three laws of motion in simple terms? I\'m having trouble understanding the practical applications.',
    subject: 'Physics',
    author: 'Mike R.',
    date: '2024-04-04',
    answers: [
      {
        id: 1,
        content: 'Here\'s a simple explanation of Newton\'s Laws:\n\n1. First Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n2. Second Law (F=ma): Force equals mass times acceleration.\n3. Third Law: For every action, there is an equal and opposite reaction.',
        author: 'Alice J.',
        date: '2024-04-04',
        helpfulVotes: 8
      }
    ]
  },
  {
    id: 3,
    title: 'Best resources for learning Python?',
    content: 'I\'m new to programming and want to learn Python. What are the best resources for beginners?',
    subject: 'Computer Science',
    author: 'Bob W.',
    date: '2024-04-03',
    answers: [
      {
        id: 1,
        content: 'Here are some great resources for learning Python:\n\n1. Python.org\'s official tutorial\n2. Codecademy\'s Python course\n3. Automate the Boring Stuff with Python (book)\n4. Python for Everybody (Coursera)\n5. Real Python tutorials',
        author: 'Emma L.',
        date: '2024-04-03',
        helpfulVotes: 15
      }
    ]
  }
];

const subjects = [
  { id: 'math', name: 'Mathematics', icon: '🔢' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'cs', name: 'Computer Science', icon: '💻' },
  { id: 'physics', name: 'Physics', icon: '⚛️' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
  { id: 'biology', name: 'Biology', icon: '🧬' },
  { id: 'english', name: 'English', icon: '📝' },
  { id: 'history', name: 'History', icon: '🏛️' },
  { id: 'languages', name: 'Languages', icon: '🌎' }
];

export default function QAForum() {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState(mockQuestions);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', subject: 'math' });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSubmitQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;

    const question = {
      id: questions.length + 1,
      title: newQuestion.title,
      content: newQuestion.content,
      subject: newQuestion.subject,
      author: currentUser?.displayName || 'Anonymous User',
      date: new Date().toISOString().split('T')[0],
      answers: []
    };

    setQuestions([question, ...questions]);
    setNewQuestion({ title: '', content: '', subject: 'math' });
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setShowOverlay(true);
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-[#F8FAFC] flex">
      {/* Subject Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Subjects</h2>
          <p className="text-sm text-gray-600">Select a subject to filter questions</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setNewQuestion({ ...newQuestion, subject: subject.id })}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 ${
                newQuestion.subject === subject.id
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
            Q&A Forum
            <span className="ml-2 text-sm font-normal text-gray-500 flex items-center">
              <span className="text-lg mr-1">
                {subjects.find(s => s.id === newQuestion.subject)?.icon}
              </span>
              {subjects.find(s => s.id === newQuestion.subject)?.name}
            </span>
          </h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* New Question Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask a Question</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Question Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              />
              <textarea
                placeholder="Your question..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
              />
              <button
                onClick={handleSubmitQuestion}
                className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post Question
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                onClick={() => handleQuestionClick(question)}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{question.title}</h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">{question.content}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {question.subject}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Asked by {question.author} on {question.date}</span>
                  <span>{question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Detail Overlay */}
      {showOverlay && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
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
                <span>Asked by {selectedQuestion.author}</span>
                <span>{selectedQuestion.date}</span>
              </div>
            </div>

            {/* Answers Section */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedQuestion.answers.length} {selectedQuestion.answers.length === 1 ? 'Answer' : 'Answers'}
              </h3>
              <div className="space-y-4">
                {selectedQuestion.answers.map((answer) => (
                  <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 whitespace-pre-line">{answer.content}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        </button>
                        <span className="text-sm text-gray-500">{answer.helpfulVotes} helpful</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Answered by {answer.author} on {answer.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 