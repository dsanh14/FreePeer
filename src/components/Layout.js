import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Don't show the header on auth pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-[#3B82F6]">StudyBuddy Connect</span>
              </Link>
              {currentUser && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive ? 'text-[#3B82F6]' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/find-tutors"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive ? 'text-[#3B82F6]' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    Find Tutors
                  </NavLink>
                  <NavLink
                    to="/resources"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive ? 'text-[#3B82F6]' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    Resources
                  </NavLink>
                  <NavLink
                    to="/qa-forum"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive ? 'text-[#3B82F6]' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    Q&A Forum
                  </NavLink>
                  <NavLink
                    to="/ai-assistant"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive ? 'text-[#3B82F6]' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    AI Assistant
                  </NavLink>
                  <NavLink
                    to="/leaderboard"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive ? 'text-[#3B82F6]' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    Leaderboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive ? 'text-[#3B82F6]' : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {!currentUser ? (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#3B82F6] text-white hover:bg-[#2563EB] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-sm font-medium"
                  >
                    {currentUser.displayName?.[0] || '?'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">StudyBuddy Connect</h3>
              <p className="text-gray-400">Making quality education accessible to everyone.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/study-resources" className="hover:text-white">Resources</Link></li>
                <li><Link to="/qa-forum" className="hover:text-white">Q&A Forum</Link></li>
                <li><Link to="/find-tutors" className="hover:text-white">Find Tutors</Link></li>
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