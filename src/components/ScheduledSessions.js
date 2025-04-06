import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ScheduledSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, [currentUser, userData?.role]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const sessionsRef = collection(db, 'sessions');
      let q;

      if (userData?.role === 'tutor') {
        q = query(
          sessionsRef,
          where('tutorId', '==', currentUser.uid),
          orderBy('startTime', 'desc')
        );
      } else {
        q = query(
          sessionsRef,
          where('participants', 'array-contains', currentUser.uid),
          orderBy('startTime', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const fetchedSessions = [];
      
      querySnapshot.forEach((doc) => {
        const sessionData = doc.data();
        // Ensure the session has all required fields and convert timestamps
        if (sessionData.startTime && sessionData.endTime) {
          fetchedSessions.push({ 
            id: doc.id, 
            ...sessionData,
            startTime: sessionData.startTime.toDate(),
            endTime: sessionData.endTime.toDate()
          });
        }
      });

      // Sort sessions by date
      fetchedSessions.sort((a, b) => a.startTime - b.startTime);
      
      setSessions(fetchedSessions);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      if (err.code === 'permission-denied') {
        setError('You need to be logged in to view your sessions.');
      } else {
        setError('Failed to fetch sessions. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const joinSession = (sessionId) => {
    navigate(`/conference/${sessionId}`);
  };

  const formatDate = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(timestamp);
  };

  const isSessionActive = (session) => {
    const now = new Date();
    return now >= session.startTime && now <= session.endTime;
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    if (now < session.startTime) {
      return 'upcoming';
    } else if (now > session.endTime) {
      return 'completed';
    } else {
      return 'active';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {userData?.role === 'tutor' ? 'No Scheduled Tutoring Sessions' : 'No Scheduled Sessions'}
              </h2>
              <p className="text-gray-600 mb-6">
                {userData?.role === 'tutor' 
                  ? "You don't have any tutoring sessions scheduled yet."
                  : "You don't have any study sessions scheduled yet. Find a tutor to get started!"}
              </p>
              {userData?.role !== 'tutor' && (
                <button 
                  onClick={() => navigate('/find-tutors')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                >
                  Find a Tutor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            {userData?.role === 'tutor' ? 'Your Tutoring Sessions' : 'Your Study Sessions'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {userData?.role === 'tutor' 
              ? 'View and manage your scheduled tutoring sessions. Join active sessions or prepare for upcoming ones.'
              : 'View and manage your scheduled study sessions. Join active sessions or prepare for upcoming ones.'}
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Active Sessions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Sessions</h2>
            <div className="grid gap-6">
              {sessions
                .filter(session => getSessionStatus(session) === 'active')
                .map(session => (
                  <div
                    key={session.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.subject} - {session.topic}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(session.startTime)}
                          </p>
                          {userData?.role === 'tutor' && (
                            <p className="text-sm text-gray-500 mt-1">
                              Student: {session.studentName}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => joinSession(session.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Join Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {sessions.filter(session => getSessionStatus(session) === 'active').length === 0 && (
                <p className="text-gray-500 text-center py-4">No active sessions at the moment.</p>
              )}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
            <div className="grid gap-6">
              {sessions
                .filter(session => getSessionStatus(session) === 'upcoming')
                .map(session => (
                  <div
                    key={session.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.subject} - {session.topic}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(session.startTime)}
                          </p>
                          {userData?.role === 'tutor' && (
                            <p className="text-sm text-gray-500 mt-1">
                              Student: {session.studentName}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Scheduled
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {sessions.filter(session => getSessionStatus(session) === 'upcoming').length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming sessions scheduled.</p>
              )}
            </div>
          </div>

          {/* Past Sessions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Sessions</h2>
            <div className="grid gap-6">
              {sessions
                .filter(session => getSessionStatus(session) === 'completed')
                .map(session => (
                  <div
                    key={session.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-gray-500"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.subject} - {session.topic}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(session.startTime)}
                          </p>
                          {userData?.role === 'tutor' && (
                            <p className="text-sm text-gray-500 mt-1">
                              Student: {session.studentName}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Completed
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {sessions.filter(session => getSessionStatus(session) === 'completed').length === 0 && (
                <p className="text-gray-500 text-center py-4">No past sessions.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 