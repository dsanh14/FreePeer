import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export default function ScheduledSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [quizTopic, setQuizTopic] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);

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

  const generateQuiz = async (topic) => {
    setQuizLoading(true);
    setQuizError('');
    setQuiz(null);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);

    try {
      const prompt = `Create a 5-question multiple-choice quiz about ${topic}.
      Each question should test understanding of key concepts that might be covered in a tutoring session.
      Use markdown formatting for emphasis and important points.
      For any mathematical equations, use LaTeX format between $$ for display equations or $ for inline equations.
      Format the response as a JSON object:
      {
        "title": "Quiz Title",
        "questions": [
          {
            "question": "Question text with markdown and LaTeX",
            "options": [
              {"text": "Option 1 with markdown and LaTeX", "isCorrect": false},
              {"text": "Option 2 with markdown and LaTeX", "isCorrect": false},
              {"text": "Option 3 with markdown and LaTeX", "isCorrect": true},
              {"text": "Option 4 with markdown and LaTeX", "isCorrect": false}
            ]
          }
        ]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const cleanedText = text
          .replace(/```json\n|\n```/g, '')
          .replace(/```/g, '')
          .trim();
        
        const parsedResponse = JSON.parse(cleanedText);
        
        if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
          throw new Error('Invalid quiz format');
        }
        
        setQuiz(parsedResponse);
      } catch (err) {
        console.error('Quiz parsing error:', err);
        setQuizError('Failed to generate quiz. Please try again.');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      setQuizError('Failed to generate quiz. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!quiz) return;

    let score = 0;
    quiz.questions.forEach((question, index) => {
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (userAnswers[index] === correctOption.text) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const formatResponse = (text) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="mb-2" {...props} />,
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  const isStudent = () => {
    return userData?.role === 'student';
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(timestamp);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Pre-session quiz section - only visible to students */}
        {isStudent() && sessions.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Prepare for your upcoming session
              </h2>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Session with {session.tutorName}
                        </h3>
                        <p className="text-gray-600">
                          {new Date(session.startTime).toLocaleDateString()} at {formatTime(session.startTime)}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Topic: {session.topic}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowQuizOverlay(true);
                          generateQuiz(session.topic);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Take Pre-Session Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quiz Overlay */}
        {showQuizOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {quiz?.title || 'Pre-Session Quiz'}
                </h2>
                <button
                  onClick={() => {
                    setShowQuizOverlay(false);
                    setQuiz(null);
                    setQuizSubmitted(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {quizLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              ) : quizError ? (
                <div className="text-red-600 text-center py-4">{quizError}</div>
              ) : quiz ? (
                <div className="space-y-8">
                  {quiz.questions.map((question, index) => (
                    <div key={index} className="space-y-4">
                      <div className="prose max-w-none">
                        {formatResponse(question.question)}
                      </div>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                              quizSubmitted
                                ? option.isCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : userAnswers[index] === option.text
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200'
                                : userAnswers[index] === option.text
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-primary-500'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option.text}
                              checked={userAnswers[index] === option.text}
                              onChange={() => {
                                if (!quizSubmitted) {
                                  setUserAnswers(prev => ({
                                    ...prev,
                                    [index]: option.text
                                  }));
                                }
                              }}
                              className="hidden"
                            />
                            <div className="prose max-w-none">
                              {formatResponse(option.text)}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        Your score: {quizScore} out of {quiz.questions.length}
                      </p>
                      <p className="text-gray-600 mt-2">
                        {quizScore === quiz.questions.length
                          ? 'Perfect! You\'re ready for the session!'
                          : quizScore >= quiz.questions.length / 2
                            ? 'Good job! You have a solid understanding.'
                            : 'Consider reviewing the topic before the session.'}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 