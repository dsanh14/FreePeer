import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function FindMatchButton({ tutors }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [bestMatch, setBestMatch] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showScheduleOverlay, setShowScheduleOverlay] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    subject: '',
    topic: '',
    date: '',
    time: '',
    duration: '30'
  });

  // Only show on the Find Tutors page
  if (location.pathname !== '/find-tutors') {
    return null;
  }

  const findBestMatch = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      // Get student profile
      const studentDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const studentData = studentDoc.data();

      // Get all tutors
      const tutorsQuery = query(collection(db, 'tutors'));
      const tutorsSnapshot = await getDocs(tutorsQuery);
      const tutors = tutorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Prepare prompt for Gemini
      const prompt = `
        You are a tutor matching assistant. Your task is to select the best tutor from the list below for the given student.

        Student Profile:
        - Subjects: ${studentData.subjects?.join(', ') || 'Not specified'}
        - Learning Style: ${studentData.learningStyle || 'Not specified'}
        - Goals: ${studentData.goals || 'Not specified'}
        - Preferred Learning Time: ${studentData.preferredTime || 'Not specified'}
        - Grade Level: ${studentData.gradeLevel || 'Not specified'}
        
        Available Tutors:
        ${tutors.map(tutor => `
          Name: ${tutor.name}
          Subjects: ${tutor.subjects?.join(', ')}
          Teaching Style: ${tutor.teachingStyle || 'Not specified'}
          Experience: ${tutor.experience || 'Not specified'}
          Rating: ${tutor.rating || 'No ratings yet'}
          Availability: ${tutor.availability?.join(', ') || 'Not specified'}
          Education: ${tutor.education || 'Not specified'}
          Bio: ${tutor.bio || 'Not specified'}
          Teaching Approach: ${tutor.teachingApproach || 'Not specified'}
          Specializations: ${tutor.specializations?.join(', ') || 'Not specified'}
        `).join('\n')}
        
        Please select the best tutor match based on:
        1. Subject expertise alignment
        2. Teaching and learning style compatibility
        3. Experience level and education
        4. Availability matching
        5. Specializations and student goals
        6. Overall fit and teaching approach

        Return your response in this exact format:
        SELECTED_TUTOR_NAME: [tutor_name]
        MATCH_REASON: [detailed explanation of why this tutor is the best match, including specific aspects of their profile that align with the student's needs]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response to get the best match
      const matchName = text.match(/SELECTED_TUTOR_NAME: (.*)/)?.[1];
      const matchReason = text.match(/MATCH_REASON: (.*)/)?.[1];
      const bestMatchTutor = tutors.find(t => t.name === matchName);

      if (bestMatchTutor) {
        setBestMatch({
          tutor: bestMatchTutor,
          explanation: matchReason || text
        });
      } else {
        setError('No suitable match found. Please try adjusting your preferences.');
      }
    } catch (err) {
      console.error('Error finding match:', err);
      setError('Failed to find a match. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSession = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setShowOverlay(true)}
        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
      >
        <span>Find My Match</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Match</h2>
              <button
                onClick={() => {
                  setShowOverlay(false);
                  setBestMatch(null);
                  setError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {bestMatch ? (
              <div className="space-y-6">
                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary-800 mb-2">Your Best Match</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {bestMatch.tutor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{bestMatch.tutor.name}</h4>
                      <p className="text-sm text-gray-500">
                        {bestMatch.tutor.subjects?.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Teaching Style: {bestMatch.tutor.teachingStyle || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Experience: {bestMatch.tutor.experience || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>Rating: {bestMatch.tutor.rating || 'No ratings yet'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Education: {bestMatch.tutor.education || 'Not specified'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Availability: {bestMatch.tutor.availability?.join(', ') || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Specializations: {bestMatch.tutor.specializations?.join(', ') || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  {bestMatch.tutor.bio && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">About</h5>
                      <p className="text-sm text-gray-600">{bestMatch.tutor.bio}</p>
                    </div>
                  )}
                  {bestMatch.tutor.teachingApproach && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Teaching Approach</h5>
                      <p className="text-sm text-gray-600">{bestMatch.tutor.teachingApproach}</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Why This Match?</h4>
                  <p className="text-gray-600">{bestMatch.explanation}</p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowOverlay(false);
                      setBestMatch(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Add navigation to tutor's profile or booking page
                      setShowOverlay(false);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowOverlay(false);
                      // Set the selected tutor and show the schedule overlay
                      const tutorCard = document.querySelector(`[data-tutor-id="${bestMatch.tutor.id}"]`);
                      if (tutorCard) {
                        const tutor = tutors.find(t => t.id === bestMatch.tutor.id);
                        if (tutor) {
                          setSelectedTutor(tutor);
                          setShowScheduleOverlay(true);
                        }
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Schedule Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Our AI will analyze your preferences and match you with the most suitable tutor.
                </p>
                <button
                  onClick={findBestMatch}
                  disabled={loading}
                  className="w-full max-w-xs mx-auto bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                      <span className="ml-2">Finding your match...</span>
                    </div>
                  ) : (
                    <span>Start Matching</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Session Overlay */}
      {showScheduleOverlay && selectedTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Schedule Session with {selectedTutor.name}</h2>
            <form onSubmit={handleScheduleSession}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    value={scheduleData.subject}
                    onChange={(e) => setScheduleData({ ...scheduleData, subject: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a subject</option>
                    {selectedTutor.subjects?.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Topic</label>
                  <input
                    type="text"
                    value={scheduleData.topic}
                    onChange={(e) => setScheduleData({ ...scheduleData, topic: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="What would you like to learn?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <select
                    value={scheduleData.duration}
                    onChange={(e) => setScheduleData({ ...scheduleData, duration: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleOverlay(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 