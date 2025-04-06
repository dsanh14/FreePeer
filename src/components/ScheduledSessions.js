import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ScheduledSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, [currentUser]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Query sessions where the user is either the tutor or the student
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('participants', 'array-contains', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(sessionsQuery);
      const fetchedSessions = [];
      
      querySnapshot.forEach((doc) => {
        fetchedSessions.push({ id: doc.id, ...doc.data() });
      });

      // Sort sessions by date
      fetchedSessions.sort((a, b) => a.startTime.toDate() - b.startTime.toDate());
      
      setSessions(fetchedSessions);
    } catch (err) {
      setError('Failed to fetch sessions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const joinSession = (sessionId) => {
    navigate(`/conference/${sessionId}`);
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const isSessionActive = (session) => {
    const now = new Date();
    const startTime = session.startTime.toDate();
    const endTime = session.endTime.toDate();
    return now >= startTime && now <= endTime;
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const startTime = session.startTime.toDate();
    const endTime = session.endTime.toDate();

    if (now < startTime) {
      return 'upcoming';
    } else if (now > endTime) {
      return 'completed';
    } else {
      return 'active';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Your Tutoring Sessions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage your scheduled tutoring sessions. Join active sessions or prepare for upcoming ones.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
} 