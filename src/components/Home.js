import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  const features = [
    {
      title: 'AI Study Assistant',
      description: 'Get instant help with homework and study materials',
      icon: '🤖',
      link: '/ai-study-assistant'
    },
    {
      title: 'Find Tutors',
      description: 'Connect with experienced peer tutors',
      icon: '👥',
      link: '/find-tutors'
    },
    {
      title: 'Study Resources',
      description: 'Access a library of study materials',
      icon: '📚',
      link: '/study-resources'
    },
    {
      title: 'Q&A Forum',
      description: 'Ask questions and help others',
      icon: '💭',
      link: '/qa-forum'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser.email}!
        </h1>
        <p className="mt-2 text-gray-600">
          Ready to continue your learning journey? Choose from the options below to get started.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="border-l-4 border-primary-500 pl-4">
            <p className="text-sm text-gray-600">Yesterday</p>
            <p className="text-gray-900">Completed Math tutoring session</p>
          </div>
          <div className="border-l-4 border-primary-500 pl-4">
            <p className="text-sm text-gray-600">2 days ago</p>
            <p className="text-gray-900">Asked question in Physics forum</p>
          </div>
          <div className="border-l-4 border-primary-500 pl-4">
            <p className="text-sm text-gray-600">3 days ago</p>
            <p className="text-gray-900">Used AI assistant for Chemistry homework</p>
          </div>
        </div>
      </div>

      {/* Study Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Study Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900">Hours Studied</h3>
            <p className="text-3xl font-bold text-primary-600">12.5</p>
            <p className="text-sm text-gray-600">This week</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900">Questions Asked</h3>
            <p className="text-3xl font-bold text-primary-600">8</p>
            <p className="text-sm text-gray-600">This week</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900">Resources Used</h3>
            <p className="text-3xl font-bold text-primary-600">15</p>
            <p className="text-sm text-gray-600">This week</p>
          </div>
        </div>
      </div>
    </div>
  );
} 