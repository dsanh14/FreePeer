import React, { useState, useMemo } from 'react';

export default function FindTutors() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [availability, setAvailability] = useState('all');

  // Sample tutor data (replace with actual data from backend)
  const tutors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      subjects: ['Mathematics', 'Physics'],
      rating: 4.8,
      reviews: 24,
      availability: 'Weekdays',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      name: 'Michael Chen',
      subjects: ['Computer Science', 'Mathematics'],
      rating: 4.9,
      reviews: 36,
      availability: 'Weekends',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      subjects: ['English', 'History'],
      rating: 4.7,
      reviews: 18,
      availability: 'Flexible',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  const subjects = [
    { id: 'all', name: 'All Subjects', icon: '📚' },
    { id: 'mathematics', name: 'Mathematics', icon: '🔢' },
    { id: 'physics', name: 'Physics', icon: '⚡' },
    { id: 'cs', name: 'Computer Science', icon: '💻' },
    { id: 'english', name: 'English', icon: '📝' },
    { id: 'history', name: 'History', icon: '🏛️' },
  ];

  const availabilityOptions = [
    { id: 'all', name: 'All Availability', icon: '📅' },
    { id: 'weekdays', name: 'Weekdays', icon: '📆' },
    { id: 'weekends', name: 'Weekends', icon: '🗓️' },
    { id: 'flexible', name: 'Flexible', icon: '⭐' },
  ];

  // Filter tutors based on selected filters
  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      // Subject filter
      if (selectedSubject !== 'all') {
        const subjectName = subjects.find(s => s.id === selectedSubject)?.name;
        if (!tutor.subjects.includes(subjectName)) {
          return false;
        }
      }

      // Availability filter
      if (availability !== 'all') {
        const availabilityName = availabilityOptions.find(a => a.id === availability)?.name;
        if (tutor.availability !== availabilityName) {
          return false;
        }
      }

      return true;
    });
  }, [selectedSubject, availability, tutors, subjects, availabilityOptions]);

  // Calculate stats for filtered results
  const stats = useMemo(() => {
    if (filteredTutors.length === 0) {
      return {
        count: 0,
        avgRating: 0,
      };
    }

    const total = filteredTutors.reduce(
      (acc, tutor) => ({
        rating: acc.rating + tutor.rating,
      }),
      { rating: 0 }
    );

    return {
      count: filteredTutors.length,
      avgRating: (total.rating / filteredTutors.length).toFixed(1),
    };
  }, [filteredTutors]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Tutor</h1>
        <p className="mt-2 text-gray-600">
          Connect with experienced peer tutors who can help you succeed in your studies.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject Filter */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 hover:border-primary-500 transition-colors duration-200"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.icon} {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <select
              id="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 hover:border-primary-500 transition-colors duration-200"
            >
              {availabilityOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.icon} {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{stats.count} tutors found</span>
            {stats.count > 0 && (
              <div className="flex space-x-4">
                <span>Average Rating: ⭐ {stats.avgRating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tutor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="h-12 w-12 rounded-full ring-2 ring-transparent hover:ring-primary-500 transition-all duration-200"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200">
                      {tutor.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="h-4 w-4 text-yellow-400 hover:text-yellow-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {tutor.rating} ({tutor.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Subjects</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {tutor.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors duration-200"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Availability</div>
                  <div className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors duration-200">
                    {tutor.availability}
                  </div>
                </div>
                <button className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-500 transform hover:translate-y-[-1px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600">
                  Schedule Session
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">No tutors found matching your filters</div>
            <button
              onClick={() => {
                setSelectedSubject('all');
                setAvailability('all');
              }}
              className="mt-4 text-primary-600 hover:text-primary-500 font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 