import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, userRole, userData } = useAuth();

  // Mock data - replace with actual data from your backend
  const stats = {
    streak: 5,
    questionsAnswered: 12,
    sessionsCompleted: 8,
    rating: 4.8
  };

  const recentActivity = [
    {
      type: 'question',
      title: 'How to solve quadratic equations?',
      date: '2024-04-05',
      status: 'answered'
    },
    {
      type: 'session',
      tutor: 'John Smith',
      subject: 'Mathematics',
      date: '2024-04-04',
      duration: '60 minutes'
    },
    {
      type: 'answer',
      question: 'Best resources for learning Python?',
      date: '2024-04-03',
      upvotes: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            {userData?.role === 'tutor' 
              ? 'Welcome back Tutor'
              : `Welcome back ${userData?.displayName || 'Student'}`
            }
          </h1>
          <p className="mt-2 text-gray-600">Here's your learning progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.streak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.questionsAnswered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sessions Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.sessionsCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.rating}/5.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4">
                {activity.type === 'question' && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-primary-100 text-primary-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">Asked on {activity.date}</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                )}
                {activity.type === 'session' && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Session with {activity.tutor}</p>
                      <p className="text-sm text-gray-500">{activity.subject} • {activity.duration}</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {activity.date}
                    </div>
                  </div>
                )}
                {activity.type === 'answer' && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Answered: {activity.question}</p>
                      <p className="text-sm text-gray-500">{activity.upvotes} upvotes</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {activity.date}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Access</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Find Tutors Card */}
          {userRole === 'student' && (
            <Link
              to="/find-tutors"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Find Tutors</dt>
                      <dd className="text-lg font-medium text-gray-900">Connect with peer tutors</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* AI Study Assistant Card */}
          <Link
            to="/ai-chat"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">AI Study Assistant</dt>
                    <dd className="text-lg font-medium text-gray-900">Get instant help</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>

          {/* Q&A Forum Card */}
          <Link
            to="/qa-forum"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Q&A Forum</dt>
                    <dd className="text-lg font-medium text-gray-900">Ask and answer questions</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>

          {/* Study Resources Card */}
          <Link
            to="/resources"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Study Resources</dt>
                    <dd className="text-lg font-medium text-gray-900">Access learning materials</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>

          {/* Leaderboard Card */}
          <Link
            to="/leaderboard"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Leaderboard</dt>
                    <dd className="text-lg font-medium text-gray-900">View top contributors</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>

          {/* Sessions Card */}
          <Link
            to="/scheduled-sessions"
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Sessions</dt>
                    <dd className="text-lg font-medium text-gray-900">Manage your sessions</dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 