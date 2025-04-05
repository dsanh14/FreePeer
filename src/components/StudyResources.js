import React from 'react';

export default function StudyResources() {
  const resources = [
    {
      category: 'Mathematics',
      items: [
        {
          title: 'Khan Academy',
          description: 'Free online courses, lessons and practice',
          link: 'https://www.khanacademy.org/math',
          icon: '📚'
        },
        {
          title: 'Wolfram Alpha',
          description: 'Computational knowledge engine',
          link: 'https://www.wolframalpha.com',
          icon: '🔢'
        }
      ]
    },
    {
      category: 'Computer Science',
      items: [
        {
          title: 'freeCodeCamp',
          description: 'Learn to code for free',
          link: 'https://www.freecodecamp.org',
          icon: '💻'
        },
        {
          title: 'LeetCode',
          description: 'Practice coding interview questions',
          link: 'https://leetcode.com',
          icon: '📝'
        }
      ]
    },
    {
      category: 'Science',
      items: [
        {
          title: 'Coursera',
          description: 'Online courses from top universities',
          link: 'https://www.coursera.org',
          icon: '🔬'
        },
        {
          title: 'MIT OpenCourseWare',
          description: 'Free course materials from MIT',
          link: 'https://ocw.mit.edu',
          icon: '🎓'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Study Resources
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Curated resources to help you excel in your studies
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((category) => (
            <div key={category.category} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-blue-600">
                <h2 className="text-xl font-semibold text-white">{category.category}</h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-4">
                  {category.items.map((item) => (
                    <li key={item.title} className="flex items-start">
                      <span className="text-2xl mr-3">{item.icon}</span>
                      <div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-blue-600 hover:text-blue-800"
                        >
                          {item.title}
                        </a>
                        <p className="mt-1 text-gray-500">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Have a resource to suggest? Contact us to add it to our collection!
          </p>
        </div>
      </div>
    </div>
  );
} 