import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    grade: '',
    subjects: [],
    learningStyle: '',
    preferredSessionLength: '',
    preferredSessionTime: '',
    additionalInfo: '',
    goals: '',
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    }
  });

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setFormData({
              grade: data.grade || '',
              subjects: data.subjects || [],
              learningStyle: data.learningStyle || '',
              preferredSessionLength: data.preferredSessionLength || '',
              preferredSessionTime: data.preferredSessionTime || '',
              additionalInfo: data.additionalInfo || '',
              goals: data.goals || '',
              availability: data.availability || {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false
              }
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Sample user stats - in a real app, these would come from a database
  const userStats = {
    level: 12,
    xp: 1250,
    nextLevelXp: 1500,
    questionsAsked: 15,
    answersGiven: 42,
    helpfulVotes: 87,
    badges: [
      { name: 'Quick Learner', icon: '🚀', description: 'Answered 10 questions within 24 hours' },
      { name: 'Helper', icon: '🤝', description: 'Received 50 helpful votes' },
      { name: 'Expert', icon: '🎓', description: 'Answered 30 questions correctly' }
    ],
    recentActivity: [
      { 
        type: 'question', 
        title: 'How to solve quadratic equations?', 
        content: 'I\'m having trouble understanding how to solve quadratic equations using the quadratic formula. Can someone explain it step by step?',
        date: '2024-03-15',
        answers: [
          {
            author: 'Jane Smith',
            content: 'The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a. Let me break it down step by step...',
            date: '2024-03-15'
          }
        ]
      },
      { 
        type: 'answer', 
        title: 'Best resources for learning Python?', 
        content: 'I recommend starting with Python.org\'s official tutorial and then moving to Codecademy\'s Python course.',
        date: '2024-03-14',
        questionId: 2
      },
      { 
        type: 'question', 
        title: 'Understanding React Hooks', 
        content: 'Can someone explain the difference between useState and useEffect hooks in React?',
        date: '2024-03-13',
        answers: [
          {
            author: 'Mike Johnson',
            content: 'useState is used for managing state in functional components, while useEffect is used for handling side effects...',
            date: '2024-03-13'
          }
        ]
      }
    ]
  };

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Computer Science',
    'Economics',
    'Psychology',
    'Spanish',
    'French',
    'German',
    'Art',
    'Music'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleAvailabilityChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        lastUpdated: new Date(),
        onboardingCompleted: true
      });
      
      // Fetch updated data
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data();
        setUserData(updatedData);
        setFormData(prev => ({
          ...prev,
          lastUpdated: new Date()
        }));
      }
      
      setIsEditing(false);
      
      // Show success message
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update preferences. Please try again.');
    }
  };

  const handleQuestionClick = (activity) => {
    setSelectedQuestion(activity);
    setShowOverlay(true);
  };

  const xpPercentage = (userStats.xp / userStats.nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {currentUser?.displayName?.[0] || '?'}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{currentUser?.displayName || 'Anonymous User'}</h1>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Level {userStats.level}</span>
              <span className="text-sm text-gray-500">{userStats.xp} / {userStats.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Badges */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Questions Asked</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600">{userStats.questionsAsked}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Answers Given</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600">{userStats.answersGiven}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Helpful Votes</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600">{userStats.helpfulVotes}</p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Badges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {userStats.badges.map((badge, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{badge.name}</h3>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {userStats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    onClick={() => handleQuestionClick(activity)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {activity.type === 'answer' ? '💬' : '❓'}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {activity.type === 'answer' ? 'Answered' : 'Asked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Learning Preferences</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Edit Preferences
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Grade Level</p>
                  <p className="mt-1 text-gray-900">{userData?.grade || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Subjects of Interest</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {userData?.subjects?.map((subject) => (
                      <span
                        key={subject}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Style & Availability</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Learning Style</p>
                  <p className="mt-1 text-gray-900">{userData?.learningStyle || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Preferred Session Length</p>
                  <p className="mt-1 text-gray-900">{userData?.preferredSessionLength ? `${userData.preferredSessionLength} minutes` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Days</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {Object.entries(userData?.availability || {}).map(([day, available]) => (
                      available && (
                        <span
                          key={day}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Overlay */}
        {showOverlay && selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedQuestion.title}</h2>
                  <button
                    onClick={() => setShowOverlay(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mt-4">{selectedQuestion.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                  <span>By {currentUser?.displayName || 'Anonymous User'}</span>
                  <span>{selectedQuestion.date}</span>
                </div>
              </div>

              {/* Answers Section */}
              {selectedQuestion.answers && selectedQuestion.answers.length > 0 && (
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedQuestion.answers.length} {selectedQuestion.answers.length === 1 ? 'Answer' : 'Answers'}
                  </h3>
                  <div className="space-y-4">
                    {selectedQuestion.answers.map((answer, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <p className="text-gray-600 mb-2">{answer.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>By {answer.author}</span>
                          <span>{answer.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Preferences Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Preferences</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade Level</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3"
                    >
                      <option value="">Select your grade</option>
                      <option value="middle-school">Middle School</option>
                      <option value="high-school">High School</option>
                      <option value="college">College</option>
                      <option value="adult-learner">Adult Learner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subjects of Interest</label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {subjects.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => handleSubjectToggle(subject)}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            formData.subjects.includes(subject)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Learning Style</label>
                    <select
                      name="learningStyle"
                      value={formData.learningStyle}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3"
                    >
                      <option value="">Select your preferred learning style</option>
                      <option value="visual">Visual Learner</option>
                      <option value="auditory">Auditory Learner</option>
                      <option value="kinesthetic">Kinesthetic Learner</option>
                      <option value="reading-writing">Reading/Writing Learner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Session Length</label>
                    <select
                      name="preferredSessionLength"
                      value={formData.preferredSessionLength}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3"
                    >
                      <option value="">Select preferred session length</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Session Time</label>
                    <select
                      name="preferredSessionTime"
                      value={formData.preferredSessionTime}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3"
                    >
                      <option value="">Select preferred session time</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 9PM)</option>
                      <option value="night">Night (9PM - 12AM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Available Days</label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {Object.keys(formData.availability).map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleAvailabilityChange(day)}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            formData.availability[day]
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Learning Goals</label>
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3"
                      placeholder="What are your main learning goals?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2 px-3"
                      placeholder="Any additional information that might help match you with the right tutor..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 