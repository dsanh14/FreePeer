import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Don't show the header on auth pages
  if (['/login', '/signup'].includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600">
                  StudyBuddy Connect
                </Link>
              </div>
              <div className="hidden sm:ml-12 sm:flex sm:space-x-8">
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-[#3B82F6] text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/find-tutors"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-[#3B82F6] text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Find Tutors
                </NavLink>
                <NavLink
                  to="/study-resources"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-[#3B82F6] text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Resources
                </NavLink>
                <NavLink
                  to="/qa-forum"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-[#3B82F6] text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Q&A Forum
                </NavLink>
                <NavLink
                  to="/ai-study-assistant"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-[#3B82F6] text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  AI Assistant
                </NavLink>
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-[#3B82F6] text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Leaderboard
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-base font-medium">
                      {currentUser.displayName?.[0] || '?'}
                    </div>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Your Profile
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#3B82F6] text-white hover:bg-[#2563EB] px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%] mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
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