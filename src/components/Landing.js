import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">StudyBuddy Connect</div>
          <div className="space-x-4">
            <Link to="/login" className="btn-outline">Log In</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Empowering Students Through Collaborative Learning
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join StudyBuddy Connect to access AI-powered academic assistance and connect with peer tutors. 
              Break down barriers to education and achieve your academic goals.
            </p>
            <div className="space-x-4">
              <Link to="/signup" className="btn-primary">Get Started Free</Link>
              <Link to="/about" className="btn-outline">Learn More</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/study-illustration.svg" 
              alt="Students studying together" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose StudyBuddy Connect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Learning",
                description: "Get instant help with homework and study materials using our advanced AI technology.",
                icon: "🤖"
              },
              {
                title: "Peer Tutoring",
                description: "Connect with experienced peer tutors for personalized learning support.",
                icon: "👥"
              },
              {
                title: "Inclusive Platform",
                description: "Access quality education resources regardless of your background.",
                icon: "🌟"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning Journey?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students already benefiting from StudyBuddy Connect.
          </p>
          <Link 
            to="/signup" 
            className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg 
                       hover:bg-gray-100 transition-colors"
          >
            Start Learning Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">StudyBuddy Connect</h3>
              <p className="text-gray-400">
                Making quality education accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} StudyBuddy Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 