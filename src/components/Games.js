import React from 'react';
import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Educational Games</h1>
        <p className="text-xl text-gray-600 mb-12">
          Enhance your learning experience through interactive educational games.
          Choose a game below to get started!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/games/text-rpg"
            className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-600">
                  Text RPG
                </h2>
                <p className="mt-2 text-gray-600">
                  Embark on an educational adventure where your choices shape the story
                  and help you learn about various academic topics.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/games/matching"
            className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-600">
                  Matching Game
                </h2>
                <p className="mt-2 text-gray-600">
                  Test your knowledge by matching terms with their definitions in this
                  engaging memory game.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 