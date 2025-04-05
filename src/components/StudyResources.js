import React from 'react';

export default function StudyResources() {
  const resources = [
    {
      category: 'Mathematics',
      description: 'Master mathematical concepts from algebra to calculus',
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
      description: 'Learn programming and computer science fundamentals',
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
      description: 'Explore physics, chemistry, and biology resources',
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
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Study Resources
          </h1>
          <p className="text-xl text-gray-600">
            Curated resources to help you excel in your studies
          </p>
        </div>

        <div className="space-y-8">
          {resources.map((category) => (
            <div key={category.category} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {category.category}
                </h2>
                <p className="text-gray-600 mb-6">
                  {category.description}
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {category.items.map((item) => (
                    <a
                      key={item.title}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#3B82F6] mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Have a resource to suggest? Contact us to add it to our collection!
          </p>
        </div>
      </div>
    </div>
  );
} 