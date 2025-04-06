import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function TutorOnboarding() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    subjects: [],
    gradeLevels: [],
    experience: '',
    bio: '',
    availability: []
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 9}:00 ${i + 9 < 12 ? 'AM' : 'PM'}`);

  const handleAvailabilityChange = (day, hour) => {
    const timeSlot = `${day} ${hour}`;
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(timeSlot)
        ? prev.availability.filter(slot => slot !== timeSlot)
        : [...prev.availability, timeSlot]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update tutor document
      await updateDoc(doc(db, 'tutors', currentUser.uid), {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      // Update user document to mark onboarding as completed
      await updateDoc(doc(db, 'users', currentUser.uid), {
        onboardingCompleted: true
      });

      navigate('/tutor-profile');
    } catch (err) {
      console.error('Error updating tutor profile:', err);
      setError('Failed to save profile');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Complete Your Tutor Profile
            </h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Subjects</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English'].map(subject => (
                    <label key={subject} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          subjects: prev.subjects.includes(subject)
                            ? prev.subjects.filter(s => s !== subject)
                            : [...prev.subjects, subject]
                        }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Grade Levels</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Elementary', 'Middle School', 'High School', 'College'].map(level => (
                    <label key={level} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.gradeLevels.includes(level)}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          gradeLevels: prev.gradeLevels.includes(level)
                            ? prev.gradeLevels.filter(l => l !== level)
                            : [...prev.gradeLevels, level]
                        }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        {days.map(day => (
                          <th key={day} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {day.slice(0, 3)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hours.map(hour => (
                        <tr key={hour}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{hour}</td>
                          {days.map(day => (
                            <td key={day} className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={formData.availability.includes(`${day} ${hour}`)}
                                onChange={() => handleAvailabilityChange(day, hour)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 