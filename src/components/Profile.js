import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();

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
      { type: 'answer', title: 'How to solve quadratic equations?', date: '2024-03-15' },
      { type: 'question', title: 'Best resources for learning Python?', date: '2024-03-14' },
      { type: 'answer', title: 'Understanding React Hooks', date: '2024-03-13' }
    ]
  };

  const xpPercentage = (userStats.xp / userStats.nextLevelXp) * 100;

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
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
    </div>
  );
} 