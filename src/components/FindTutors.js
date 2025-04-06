import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FindMatchButton from './FindMatchButton';

export default function FindTutors() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showScheduleOverlay, setShowScheduleOverlay] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    subject: '',
    topic: '',
    date: '',
    time: '',
    duration: '60', // Default 1 hour
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const tutorsQuery = query(
          collection(db, 'tutors')
        );
        const querySnapshot = await getDocs(tutorsQuery);
        const tutorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTutors(tutorsData);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        if (err.code === 'permission-denied') {
          setError('You need to be logged in to view tutors. Please sign in and try again.');
        } else {
          setError('Failed to load tutors. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    try {
      const sessionData = {
        tutorId: selectedTutor.id,
        studentId: currentUser.uid,
        tutorName: selectedTutor.name,
        studentName: currentUser.displayName,
        subject: scheduleData.subject,
        topic: scheduleData.topic,
        startTime: new Date(`${scheduleData.date}T${scheduleData.time}`),
        endTime: new Date(new Date(`${scheduleData.date}T${scheduleData.time}`).getTime() + (parseInt(scheduleData.duration) * 60000)),
        status: 'scheduled',
        participants: [currentUser.uid, selectedTutor.id],
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'sessions'), sessionData);
      setShowScheduleOverlay(false);
      navigate('/scheduled-sessions');
    } catch (err) {
      console.error('Error scheduling session:', err);
      setError('Failed to schedule session. Please try again.');
    }
  };

  // Get unique subjects from tutors
  const subjects = [
    { id: 'all', name: 'All Subjects', icon: '📚' },
    ...Array.from(new Set(tutors.flatMap(tutor => tutor.subjects || [])))
      .map(subject => ({
        id: subject.toLowerCase(),
        name: subject,
        icon: '📚'
      }))
  ];

  const availabilityOptions = [
    { id: 'weekdays', name: 'Weekdays', icon: '📆', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'weekends', name: 'Weekends', icon: '🗓️', days: ['Saturday', 'Sunday'] },
    { id: 'mornings', name: 'Mornings', icon: '🌅', timeRange: { start: '06:00', end: '12:00' } },
    { id: 'afternoons', name: 'Afternoons', icon: '☀️', timeRange: { start: '12:00', end: '17:00' } },
    { id: 'evenings', name: 'Evenings', icon: '🌙', timeRange: { start: '17:00', end: '22:00' } },
  ];

  // Filter tutors based on selected filters
  const filteredTutors = tutors.filter(tutor => {
    // Subject filter
    if (selectedSubject !== 'all') {
      const subjectName = subjects.find(s => s.id === selectedSubject)?.name;
      if (!tutor.subjects?.includes(subjectName)) {
        return false;
      }
    }

    // Availability filter
    if (selectedAvailability.length > 0) {
      const hasMatchingAvailability = selectedAvailability.some(selected => {
        const option = availabilityOptions.find(opt => opt.name === selected);
        
        // Check for day-based availability (weekdays/weekends)
        if (option.days) {
          // Get all unique days from the tutor's availability
          const tutorDays = new Set(
            tutor.availability
              ?.map(slot => {
                const [day] = slot.split(' ');
                return day;
              })
              .filter(day => day) // Remove any undefined values
          );

          // Check if any of the required days are in the tutor's availability
          return option.days.some(day => tutorDays.has(day));
        }
        
        // Check for time-based availability (mornings/afternoons/evenings)
        if (option.timeRange) {
          return tutor.availability?.some(slot => {
            if (!slot || typeof slot !== 'string') return false;
            
            const parts = slot.split(' ');
            if (parts.length < 2) return false;
            
            const time = parts[1];
            if (!time || !time.includes(':')) return false;
            
            const hour = parseInt(time.split(':')[0]);
            if (isNaN(hour)) return false;
            
            const startHour = parseInt(option.timeRange.start.split(':')[0]);
            const endHour = parseInt(option.timeRange.end.split(':')[0]);
            
            return hour >= startHour && hour < endHour;
          });
        }
        
        return false;
      });
      
      if (!hasMatchingAvailability) {
        return false;
      }
    }

    return true;
  });

  // Helper function to format time ranges
  const formatTimeRange = (time) => {
    if (!time || !time.includes(':')) return time;
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    if (isNaN(hour)) return time;
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Helper function to get best times for a tutor
  const getBestTimes = (tutor) => {
    if (!tutor.availability) return null;
    
    const timeSlots = tutor.availability.filter(slot => {
      if (!slot || typeof slot !== 'string') return false;
      return slot.includes(':');
    });
    
    if (timeSlots.length === 0) return null;

    const timeRanges = availabilityOptions
      .filter(opt => opt.timeRange)
      .map(opt => ({
        name: opt.name,
        count: timeSlots.filter(slot => {
          const time = slot.split(' ')[1];
          if (!time || !time.includes(':')) return false;
          
          const hour = parseInt(time.split(':')[0]);
          if (isNaN(hour)) return false;
          
          const startHour = parseInt(opt.timeRange.start.split(':')[0]);
          const endHour = parseInt(opt.timeRange.end.split(':')[0]);
          
          return hour >= startHour && hour < endHour;
        }).length
      }))
      .filter(range => range.count > 0)
      .sort((a, b) => b.count - a.count);

    return timeRanges.length > 0 ? timeRanges[0].name : null;
  };

  // Calculate stats for filtered results
  const stats = {
    count: filteredTutors.length,
    avgRating: filteredTutors.length > 0
      ? (filteredTutors.reduce((acc, tutor) => acc + (tutor.rating || 0), 0) / filteredTutors.length).toFixed(1)
      : 0
  };

  const toggleAvailability = (availability) => {
    setSelectedAvailability(prev => {
      if (prev.includes(availability)) {
        return prev.filter(a => a !== availability);
      } else {
        return [...prev, availability];
      }
    });
  };

  const seedTutors = async () => {
    const tutorsData = [
      {
        name: 'Sarah Johnson',
        subjects: ['Mathematics', 'Physics'],
        gradeLevels: ['High School', 'College'],
        rating: 4.8,
        reviews: 24,
        teachingStyle: 'Interactive and problem-solving focused',
        experience: '5 years',
        photoURL: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
        availability: [
          'Monday 09:00',
          'Monday 14:00',
          'Tuesday 10:00',
          'Tuesday 15:00',
          'Wednesday 09:00',
          'Wednesday 16:00',
          'Thursday 11:00',
          'Thursday 17:00',
          'Friday 10:00',
          'Friday 15:00'
        ]
      },
      {
        name: 'Michael Chen',
        subjects: ['Computer Science', 'Mathematics'],
        gradeLevels: ['Middle School', 'High School'],
        rating: 4.9,
        reviews: 32,
        teachingStyle: 'Hands-on and project-based learning',
        experience: '3 years',
        photoURL: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
        availability: [
          'Monday 13:00',
          'Monday 18:00',
          'Tuesday 14:00',
          'Tuesday 19:00',
          'Wednesday 13:00',
          'Wednesday 18:00',
          'Thursday 14:00',
          'Thursday 19:00',
          'Friday 13:00',
          'Friday 18:00'
        ]
      },
      {
        name: 'Emily Rodriguez',
        subjects: ['English', 'History'],
        gradeLevels: ['Elementary', 'Middle School'],
        rating: 4.7,
        reviews: 18,
        teachingStyle: 'Discussion-based and creative approach',
        experience: '4 years',
        photoURL: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=random',
        availability: [
          'Monday 08:00',
          'Monday 15:00',
          'Tuesday 09:00',
          'Tuesday 16:00',
          'Wednesday 08:00',
          'Wednesday 15:00',
          'Thursday 09:00',
          'Thursday 16:00',
          'Friday 08:00',
          'Friday 15:00'
        ]
      },
      {
        name: 'David Kim',
        subjects: ['Chemistry', 'Biology'],
        gradeLevels: ['High School', 'College'],
        rating: 4.6,
        reviews: 21,
        teachingStyle: 'Visual and experimental learning',
        experience: '6 years',
        photoURL: 'https://ui-avatars.com/api/?name=David+Kim&background=random',
        availability: [
          'Monday 10:00',
          'Monday 16:00',
          'Tuesday 11:00',
          'Tuesday 17:00',
          'Wednesday 10:00',
          'Wednesday 16:00',
          'Thursday 11:00',
          'Thursday 17:00',
          'Friday 10:00',
          'Friday 16:00'
        ]
      },
      {
        name: 'Lisa Patel',
        subjects: ['Spanish', 'French'],
        gradeLevels: ['Middle School', 'High School'],
        rating: 4.9,
        reviews: 28,
        teachingStyle: 'Immersion and conversational focus',
        experience: '7 years',
        photoURL: 'https://ui-avatars.com/api/?name=Lisa+Patel&background=random',
        availability: [
          'Monday 12:00',
          'Monday 17:00',
          'Tuesday 13:00',
          'Tuesday 18:00',
          'Wednesday 12:00',
          'Wednesday 17:00',
          'Thursday 13:00',
          'Thursday 18:00',
          'Friday 12:00',
          'Friday 17:00'
        ]
      },
      {
        name: 'Alex Thompson',
        subjects: ['Computer Science', 'Mathematics'],
        gradeLevels: ['High School', 'College'],
        rating: 4.8,
        reviews: 15,
        teachingStyle: 'Project-based and practical approach',
        experience: '4 years',
        photoURL: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=random',
        availability: [
          'Saturday 10:00',
          'Saturday 15:00',
          'Saturday 20:00',
          'Sunday 11:00',
          'Sunday 16:00',
          'Sunday 21:00'
        ]
      },
      {
        name: 'Rachel Williams',
        subjects: ['English', 'Literature'],
        gradeLevels: ['High School', 'College'],
        rating: 4.7,
        reviews: 22,
        teachingStyle: 'Discussion and analysis focused',
        experience: '5 years',
        photoURL: 'https://ui-avatars.com/api/?name=Rachel+Williams&background=random',
        availability: [
          'Saturday 09:00',
          'Saturday 14:00',
          'Saturday 19:00',
          'Sunday 10:00',
          'Sunday 15:00',
          'Sunday 20:00'
        ]
      },
      {
        name: 'James Wilson',
        subjects: ['Physics', 'Mathematics'],
        gradeLevels: ['High School', 'College'],
        rating: 4.9,
        reviews: 19,
        teachingStyle: 'Problem-solving and conceptual understanding',
        experience: '6 years',
        photoURL: 'https://ui-avatars.com/api/?name=James+Wilson&background=random',
        availability: [
          'Monday 20:00',
          'Tuesday 21:00',
          'Wednesday 20:00',
          'Thursday 21:00',
          'Friday 20:00',
          'Saturday 19:00',
          'Sunday 19:00'
        ]
      },
      {
        name: 'Sophia Martinez',
        subjects: ['Biology', 'Chemistry'],
        gradeLevels: ['High School', 'College'],
        rating: 4.8,
        reviews: 17,
        teachingStyle: 'Visual and interactive learning',
        experience: '4 years',
        photoURL: 'https://ui-avatars.com/api/?name=Sophia+Martinez&background=random',
        availability: [
          'Monday 19:00',
          'Tuesday 20:00',
          'Wednesday 19:00',
          'Thursday 20:00',
          'Friday 19:00',
          'Saturday 18:00',
          'Sunday 18:00'
        ]
      },
      {
        name: 'Daniel Lee',
        subjects: ['Computer Science', 'Mathematics'],
        gradeLevels: ['Middle School', 'High School'],
        rating: 4.7,
        reviews: 14,
        teachingStyle: 'Hands-on coding and problem-solving',
        experience: '3 years',
        photoURL: 'https://ui-avatars.com/api/?name=Daniel+Lee&background=random',
        availability: [
          'Saturday 08:00',
          'Saturday 13:00',
          'Saturday 18:00',
          'Sunday 09:00',
          'Sunday 14:00',
          'Sunday 19:00'
        ]
      }
    ];

    try {
      for (const tutor of tutorsData) {
        await addDoc(collection(db, 'tutors'), tutor);
      }
      console.log('Tutors seeded successfully');
    } catch (error) {
      console.error('Error seeding tutors:', error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Tutor</h1>
                <p className="mt-2 text-gray-600">
                  Connect with experienced peer tutors who can help you succeed in your studies.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={seedTutors}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Seed Tutors
                </button>
                <FindMatchButton tutors={tutors} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject Filter */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 hover:border-primary-500 transition-colors duration-200"
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availabilityOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleAvailability(option.name)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                        selectedAvailability.includes(option.name)
                          ? 'bg-primary-50 border-primary-500 text-primary-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span className="text-sm">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{stats.count} tutors found</span>
                {stats.count > 0 && (
                  <div className="flex space-x-4">
                    <span>Average Rating: ⭐ {stats.avgRating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tutor List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div 
                key={tutor.id} 
                data-tutor-id={tutor.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] flex flex-col h-full"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={tutor.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name || 'Tutor')}&background=random`}
                        alt={tutor.name}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-transparent hover:ring-primary-500 transition-all duration-200"
                      />
                      {tutor.availability && (
                        <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200">
                        {tutor.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {tutor.rating || 'No ratings yet'} ({tutor.reviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-grow">
                    <div className="text-sm text-gray-500">Subjects</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {tutor.subjects?.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-500">Grade Levels</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {tutor.gradeLevels?.map((level, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-500">Availability</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {tutor.availability?.map((slot, index) => {
                        const [day, time] = slot.split(' ');
                        if (time) {
                          return (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {day} {formatTimeRange(time)}
                            </span>
                          );
                        }
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {slot}
                          </span>
                        );
                      })}
                    </div>
                    {getBestTimes(tutor) && (
                      <div className="mt-2 text-sm text-gray-600">
                        Best time: {getBestTimes(tutor)}
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setScheduleData(prev => ({
                          ...prev,
                          subject: tutor.subjects?.[0] || ''
                        }));
                        setShowScheduleOverlay(true);
                      }}
                      className="w-full bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-500 transform hover:translate-y-[-1px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600"
                    >
                      Schedule Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule Session Overlay */}
          {showScheduleOverlay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Schedule Session with {selectedTutor?.name}</h2>
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
                        {selectedTutor?.subjects?.map((subject, index) => (
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
      </div>
    </div>
  );
} 