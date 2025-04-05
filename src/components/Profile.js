import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Sample user stats - in a real app, these would come from a database
  const userStats = {
    level: 12,
    xp: 1250,
    nextLevelXp: 1500,
    questionsAsked: 15,
    answersGiven: 42,
    helpfulVotes: 87,
    badges: [
      { name: 'Quick Learner', icon: '🚀', description: 'Answered 10 questions within 24 hours' },
      { name: 'Helper', icon: '🤝', description: 'Received 50 helpful votes' },
      { name: 'Expert', icon: '🎓', description: 'Answered 30 questions correctly' }
    ],
    recentActivity: [
      { 
        type: 'question', 
        title: 'How to solve quadratic equations?', 
        content: 'I\'m having trouble understanding how to solve quadratic equations using the quadratic formula. Can someone explain it step by step?',
        date: '2024-03-15',
        answers: [
          {
            author: 'Jane Smith',
            content: 'The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a. Let me break it down step by step...',
            date: '2024-03-15'
          }
        ]
      },
      { 
        type: 'answer', 
        title: 'Best resources for learning Python?', 
        content: 'I recommend starting with Python.org\'s official tutorial and then moving to Codecademy\'s Python course.',
        date: '2024-03-14',
        questionId: 2
      },
      { 
        type: 'question', 
        title: 'Understanding React Hooks', 
        content: 'Can someone explain the difference between useState and useEffect hooks in React?',
        date: '2024-03-13',
        answers: [
          {
            author: 'Mike Johnson',
            content: 'useState is used for managing state in functional components, while useEffect is used for handling side effects...',
            date: '2024-03-13'
          }
        ]
      }
    ]
  };

  const xpPercentage = (userStats.xp / userStats.nextLevelXp) * 100;

  const handleQuestionClick = (activity) => {
    setSelectedQuestion(activity);
    setShowOverlay(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.displayName?.[0] || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.displayName || 'Anonymous User'}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Level {userStats.level}</span>
              <span className="text-sm text-gray-500">{userStats.xp} / {userStats.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#3B82F6] h-2.5 rounded-full"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions Asked</h3>
            <p className="text-3xl font-bold text-[#3B82F6]">{userStats.questionsAsked}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Answers Given</h3>
            <p className="text-3xl font-bold text-[#3B82F6]">{userStats.answersGiven}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Helpful Votes</h3>
            <p className="text-3xl font-bold text-[#3B82F6]">{userStats.helpfulVotes}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userStats.badges.map((badge, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {userStats.recentActivity.map((activity, index) => (
              <div
                key={index}
                onClick={() => handleQuestionClick(activity)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">
                    {activity.type === 'answer' ? '💬' : '❓'}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {activity.type === 'answer' ? 'Answered' : 'Asked'}
                </span>
              </div>
            ))}
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
                <span>By {user?.displayName || 'Anonymous User'}</span>
                <span>{selectedQuestion.date}</span>
              </div>
            </div>

            {/* Answers Section */}
            {selectedQuestion.answers && selectedQuestion.answers.length > 0 && (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedQuestion.answers.length} {selectedQuestion.answers.length === 1 ? 'Answer' : 'Answers'}
                </h3>
                <div className="space-y-4">
                  {selectedQuestion.answers.map((answer, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 mb-2">{answer.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {answer.author}</span>
                        <span>{answer.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 