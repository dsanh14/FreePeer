import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TutorDashboard() {
  const [activeTab, setActiveTab] = useState('sessions');

  // Sample data - replace with actual data from backend
  const upcomingSessions = [
    {
      id: 1,
      student: 'John Smith',
      subject: 'Mathematics',
      date: '2024-03-20',
      time: '14:00',
      duration: '1 hour',
      status: 'Confirmed'
    },
    {
      id: 2,
      student: 'Emily Johnson',
      subject: 'Physics',
      date: '2024-03-21',
      time: '15:30',
      duration: '1.5 hours',
      status: 'Pending'
    }
  ];

  const pastSessions = [
    {
      id: 3,
      student: 'Michael Brown',
      subject: 'Computer Science',
      date: '2024-03-18',
      time: '10:00',
      duration: '1 hour',
      rating: 4.8,
      feedback: 'Great session! Very helpful and patient.'
    }
  ];

  const stats = {
    totalSessions: 12,
    averageRating: 4.7,
    hoursTutored: 15,
    studentsHelped: 8
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tutor Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your tutoring overview.</p>
          </div>
          <Link
            to="/tutor-profile"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sessions', value: stats.totalSessions, icon: '📅' },
          { label: 'Average Rating', value: stats.averageRating, icon: '⭐' },
          { label: 'Hours Tutored', value: stats.hoursTutored, icon: '⏱️' },
          { label: 'Students Helped', value: stats.studentsHelped, icon: '👥' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-4">{stat.icon}</span>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'sessions'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming Sessions
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past Sessions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sessions' ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{session.student}</h3>
                      <p className="text-sm text-gray-500">{session.subject}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      session.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{session.date} at {session.time}</span>
                    <span className="mx-2">•</span>
                    <span>{session.duration}</span>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-500">
                      Start Session
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {pastSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{session.student}</h3>
                      <p className="text-sm text-gray-500">{session.subject}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm font-medium">{session.rating}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{session.date} at {session.time}</span>
                    <span className="mx-2">•</span>
                    <span>{session.duration}</span>
                  </div>
                  {session.feedback && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">Feedback:</p>
                      <p>{session.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tutor Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/tutor-guide"
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900">Tutor Guide</h3>
            <p className="text-sm text-gray-500">Best practices and tips for effective tutoring</p>
          </Link>
          <Link
            to="/teaching-materials"
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900">Teaching Materials</h3>
            <p className="text-sm text-gray-500">Access our library of teaching resources</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 