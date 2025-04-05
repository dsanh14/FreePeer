import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Onboarding() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    grade: '',
    subjects: [],
    learningStyle: '',
    preferredTutorGender: '',
    preferredTutorAge: '',
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
    },
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

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
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Save user preferences to Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...formData,
        onboardingCompleted: true,
        lastUpdated: new Date()
      }, { merge: true });

      navigate('/home');
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Grade Level</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Learning Style</label>
                <select
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select preferred session time</option>
                  <option value="morning">Morning (8AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 9PM)</option>
                  <option value="night">Night (9PM - 12AM)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Select your available days</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Object.keys(formData.availability).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleAvailabilityChange(day)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Any additional information that might help match you with the right tutor..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to StudyBuddy Connect!</h1>
          <p className="text-gray-600">Let's set up your profile to help you find the perfect study partners.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStep()}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Complete Setup
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 