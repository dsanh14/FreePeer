import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TutorProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const tutorDoc = await getDoc(doc(db, 'tutors', currentUser.uid));
        if (tutorDoc.exists()) {
          setProfile(tutorDoc.data());
        }
      } catch (err) {
        console.error('Error loading tutor profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [currentUser.uid]);

  const handleUpdate = async (updates) => {
    try {
      setError('');
      setSuccess('');
      await updateDoc(doc(db, 'tutors', currentUser.uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setProfile(prev => ({ ...prev, ...updates }));
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Tutor Profile
            </h3>
            <div className="mt-5">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900">Subjects</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {profile.subjects.map((subject, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900">Grade Levels</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {profile.gradeLevels.map((level, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900">Experience</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {profile.experience} years of tutoring experience
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900">Bio</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {profile.bio}
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900">Availability</h4>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(profile.availability).map(([day, times]) => (
                      <div key={day} className="border rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-900 capitalize">{day}</h5>
                        <div className="mt-2 space-y-2">
                          {Object.entries(times).map(([time, available]) => (
                            <div key={time} className="flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${available ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className="text-sm text-gray-700 capitalize">{time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate('/tutor-onboarding')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 