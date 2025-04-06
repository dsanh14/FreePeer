import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

function TutorMatch() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const tutorsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'tutor')
        );
        const querySnapshot = await getDocs(tutorsQuery);
        const tutorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTutors(tutorsData);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const subjects = ['all', ...new Set(tutors.map(tutor => tutor.subject))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Tutor</h1>
        
        <div className="mb-8">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject === 'all' ? 'All Subjects' : subject}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors
            .filter(tutor => selectedSubject === 'all' || tutor.subject === selectedSubject)
            .map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{tutor.name}</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Subject:</span> {tutor.subject}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Level:</span> {tutor.level || 'All Levels'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Rating:</span> {tutor.rating || 'No ratings yet'}
                    </p>
                    {tutor.availability && (
                      <div>
                        <p className="font-medium text-gray-600 mb-2">Availability:</p>
                        <div className="flex flex-wrap gap-2">
                          {tutor.availability.map((slot, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50">
                  <button
                    onClick={() => {
                      // TODO: Implement booking functionality
                      alert(`Booking session with ${tutor.name}`);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
        </div>

        {tutors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tutors found. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorMatch; 