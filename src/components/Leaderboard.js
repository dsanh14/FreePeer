import React, { useState } from 'react';

export default function Leaderboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  // Sample leaderboard data - in a real app, this would come from a database
  const leaderboardData = {
    all: [
      { rank: 1, name: 'Sarah M.', points: 152, questions: 25, answers: 87, helpfulVotes: 120 },
      { rank: 2, name: 'John D.', points: 98, questions: 15, answers: 42, helpfulVotes: 87 },
      { rank: 3, name: 'Mike R.', points: 87, questions: 12, answers: 35, helpfulVotes: 75 },
      { rank: 4, name: 'Alice J.', points: 76, questions: 10, answers: 30, helpfulVotes: 65 },
      { rank: 5, name: 'Bob W.', points: 65, questions: 8, answers: 25, helpfulVotes: 55 },
      { rank: 6, name: 'Emma L.', points: 54, questions: 7, answers: 20, helpfulVotes: 45 },
      { rank: 7, name: 'David K.', points: 43, questions: 6, answers: 15, helpfulVotes: 35 },
      { rank: 8, name: 'Lisa P.', points: 32, questions: 5, answers: 12, helpfulVotes: 25 },
      { rank: 9, name: 'Tom H.', points: 21, questions: 4, answers: 10, helpfulVotes: 15 },
      { rank: 10, name: 'Anna B.', points: 10, questions: 3, answers: 5, helpfulVotes: 10 }
    ],
    month: [
      { rank: 1, name: 'Sarah M.', points: 45, questions: 8, answers: 25, helpfulVotes: 35 },
      { rank: 2, name: 'John D.', points: 32, questions: 5, answers: 15, helpfulVotes: 25 },
      { rank: 3, name: 'Mike R.', points: 28, questions: 4, answers: 12, helpfulVotes: 20 },
      { rank: 4, name: 'Alice J.', points: 25, questions: 3, answers: 10, helpfulVotes: 18 },
      { rank: 5, name: 'Bob W.', points: 20, questions: 2, answers: 8, helpfulVotes: 15 }
    ],
    week: [
      { rank: 1, name: 'Sarah M.', points: 15, questions: 3, answers: 8, helpfulVotes: 12 },
      { rank: 2, name: 'John D.', points: 12, questions: 2, answers: 5, helpfulVotes: 10 },
      { rank: 3, name: 'Mike R.', points: 10, questions: 2, answers: 4, helpfulVotes: 8 },
      { rank: 4, name: 'Alice J.', points: 8, questions: 1, answers: 3, helpfulVotes: 6 },
      { rank: 5, name: 'Bob W.', points: 5, questions: 1, answers: 2, helpfulVotes: 4 }
    ]
  };

  const timeframes = [
    { id: 'all', name: 'All Time' },
    { id: 'month', name: 'This Month' },
    { id: 'week', name: 'This Week' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Global Leaderboard</h1>
          
          {/* Timeframe Selector */}
          <div className="flex space-x-2 mb-6">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setSelectedTimeframe(timeframe.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedTimeframe === timeframe.id
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {timeframe.name}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helpful Votes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboardData[selectedTimeframe].map((user) => (
                  <tr key={user.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        user.rank === 3 ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        #{user.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {user.name[0]}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{user.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.questions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.answers}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.helpfulVotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How Points Work */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How Points Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Asking Questions</h3>
              <p className="text-sm text-gray-600">+2 points for each question asked</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Answering Questions</h3>
              <p className="text-sm text-gray-600">+5 points for each answer</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Helpful Votes</h3>
              <p className="text-sm text-gray-600">+1 point for each helpful vote received</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 