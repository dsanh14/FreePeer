import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-primary-600">StudyBuddy Connect</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with expert tutors, access AI-powered study assistance, and enhance your learning experience with interactive educational games.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {!currentUser ? (
              <>
                <div className="rounded-md shadow">
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Sign In
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-md shadow">
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Features
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to enhance your learning experience
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">AI Study Assistant</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get instant help with your studies using our AI-powered assistant that can explain concepts, solve problems, and provide personalized learning recommendations.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Expert Tutors</h3>
                <p className="mt-2 text-base text-gray-500">
                  Connect with qualified tutors for one-on-one sessions, get personalized help, and improve your understanding of difficult subjects.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Educational Games</h3>
                <p className="mt-2 text-base text-gray-500">
                  Make learning fun with our interactive games that help reinforce concepts and test your knowledge in an engaging way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 