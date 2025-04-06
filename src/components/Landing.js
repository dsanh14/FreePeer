import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const svgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        svg.style.opacity = '1';
        svg.style.transform = 'translateY(0)';
      } else {
        svg.style.opacity = '0';
        svg.style.transform = 'translateY(20px)';
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
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
          <div 
            ref={svgRef}
            className="hidden md:block transition-all duration-500 ease-out"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
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

      {/* Become a Tutor Section */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Become a Tutor</h2>
            <p className="text-lg text-gray-600 mb-8">
              Share your knowledge and help other students succeed. Join our community of peer tutors and make a difference in students' lives.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Tutor with Us?</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Flexible scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Build your teaching experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Help students in need</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Join a supportive community</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Strong academic background</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Excellent communication skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Passion for teaching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>Reliable internet connection</span>
                  </li>
                </ul>
              </div>
            </div>
            <Link 
              to="/tutor-application" 
              className="inline-block px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg 
                         hover:bg-primary-500 transition-colors"
            >
              Apply to Become a Tutor
            </Link>
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
    </div>
  );
} 