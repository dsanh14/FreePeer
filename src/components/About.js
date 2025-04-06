import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About FreePeer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering students through peer-to-peer learning and AI-powered assistance
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            FreePeer was founded with a simple yet powerful mission: to make quality education accessible to everyone. 
            We believe that learning should be free, collaborative, and supported by the latest technology.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessible Education</h3>
              <p className="text-gray-600">
                Breaking down barriers to education by providing free, high-quality learning resources and support.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Peer Learning</h3>
              <p className="text-gray-600">
                Creating a community where students can learn from and support each other through collaborative learning.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Assistance</h3>
              <p className="text-gray-600">
                Leveraging artificial intelligence to provide personalized learning support and instant help when needed.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Study Assistant</h3>
                <p className="text-gray-600">
                  Get instant help with your studies through our AI-powered assistant. Ask questions, get explanations, 
                  and receive personalized learning support 24/7.
                </p>
              </div>
              <div className="md:w-1/3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Peer Tutoring</h3>
                <p className="text-gray-600">
                  Connect with fellow students who can help you understand difficult concepts. Our matching system 
                  ensures you find the right tutor for your needs.
                </p>
              </div>
              <div className="md:w-1/3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Resources</h3>
                <p className="text-gray-600">
                  Access a vast library of study materials, practice problems, and educational resources curated 
                  by students and educators.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Q&A Forum</h3>
                <p className="text-gray-600">
                  Join our community of learners. Ask questions, share knowledge, and collaborate with peers 
                  from around the world.
                </p>
              </div>
              <div className="md:w-1/3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your learning journey with our progress tracking tools. Set goals, track achievements, 
                  and celebrate your success.
                </p>
              </div>
              <div className="md:w-1/3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Support</h3>
                <p className="text-gray-600">
                  Be part of a supportive learning community. Share experiences, motivate each other, and grow 
                  together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
          <p className="text-gray-600 mb-8">
            FreePeer is built by a passionate team of educators, developers, and students who believe in the 
            power of collaborative learning and technology to transform education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Jane Smith</h3>
              <p className="text-gray-600">Head of Education</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Mike Johnson</h3>
              <p className="text-gray-600">Lead Developer</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to start your learning journey? Join thousands of students who are already benefiting from 
            FreePeer's collaborative learning platform.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/signup"
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Sign Up Now
            </a>
            <a
              href="/login"
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 