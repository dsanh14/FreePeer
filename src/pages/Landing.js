import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaRobot, FaUsers, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Landing() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const features = [
    {
      icon: FaRobot,
      title: 'AI Study Buddy',
      description: 'Get instant help from our intelligent AI tutor, available 24/7.',
    },
    {
      icon: FaUsers,
      title: 'Peer Tutoring',
      description: 'Connect with experienced tutors for personalized learning support.',
    },
    {
      icon: FaGraduationCap,
      title: 'Q&A Forum',
      description: 'Ask questions and get answers from our community of learners.',
    },
    {
      icon: FaChartLine,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">The smartest way to</span>
              <span className="block text-primary-600">learn and grow</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              StudyBuddy Connect combines AI-powered tutoring with peer support to help you master any subject.
              Get instant help, connect with tutors, and track your progress.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
              <div className="space-x-4">
                {!currentUser ? (
                  <>
                    <button
                      onClick={() => navigate('/signup')}
                      className="btn-primary"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-outline"
                    >
                      Log In
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <img
                className="w-full rounded-lg"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Students studying"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Our comprehensive platform provides all the tools you need for academic success.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!currentUser && (
        <div className="bg-primary-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to boost your learning?</span>
              <span className="block">Start using StudyBuddy Connect today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-100">
              Join thousands of students who are already improving their grades with our platform.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
            >
              Sign up for free
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing; 