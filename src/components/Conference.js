import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Conference() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { sessionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));
      if (!sessionDoc.exists()) {
        throw new Error('Session not found');
      }

      const sessionData = sessionDoc.data();
      
      // Only verify user is a participant if they are logged in
      if (currentUser && !sessionData.participants.includes(currentUser.uid)) {
        throw new Error('Unauthorized to join this session');
      }

      setSession(sessionData);

      // If there's no Zoom meeting, create one
      if (!sessionData.zoomMeetingId) {
        await createZoomMeeting(sessionData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createZoomMeeting = async (sessionData) => {
    try {
      // Create a Zoom meeting using your backend API
      const response = await fetch('http://localhost:3001/api/create-zoom-meeting', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          topic: `${sessionData.subject} - ${sessionData.topic}`,
          start_time: new Date().toISOString(), // Use current time for instant meetings
          duration: Math.ceil((sessionData.endTime.toDate() - sessionData.startTime.toDate()) / (60 * 1000)),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create Zoom meeting');
      }

      const { meetingId, joinUrl, startUrl } = await response.json();

      // Update the session with Zoom details
      await updateDoc(doc(db, 'sessions', sessionId), {
        zoomMeetingId: meetingId,
        zoomJoinUrl: joinUrl,
        zoomStartUrl: startUrl,
      });

      setSession(prev => ({
        ...prev,
        zoomMeetingId: meetingId,
        zoomJoinUrl: joinUrl,
        zoomStartUrl: startUrl,
      }));

      return { meetingId, joinUrl, startUrl };
    } catch (err) {
      setError('Failed to create Zoom meeting: ' + err.message);
      throw err;
    }
  };

  const joinMeeting = () => {
    if (!session.zoomJoinUrl) {
      setError('Meeting URL not available');
      return;
    }

    // For tutors or logged-in users, use the start URL, for anonymous users use the join URL
    const url = (currentUser && currentUser.uid === session.tutorId) ? session.zoomStartUrl : session.zoomJoinUrl;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => navigate('/scheduled-sessions')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Return to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {session.subject} - {session.topic}
              </h1>
              <p className="text-gray-600">
                Session ID: {sessionId}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Meeting Status</h3>
                  <p className="text-sm text-gray-500">
                    {session.zoomMeetingId ? 'Ready to join' : 'Setting up meeting...'}
                  </p>
                </div>
                {session.zoomMeetingId && (
                  <button
                    onClick={joinMeeting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Join Meeting
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Session Info</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Start Time: {session.startTime.toDate().toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {Math.ceil((session.endTime.toDate() - session.startTime.toDate()) / (60 * 1000))} minutes
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Meeting Details</h3>
                  <div className="space-y-1">
                    {session.zoomMeetingId && (
                      <p className="text-sm text-gray-500">
                        Meeting ID: {session.zoomMeetingId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 