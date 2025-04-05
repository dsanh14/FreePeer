import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TutorApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    gpa: '',
    subjects: [],
    experience: '',
    availability: [],
    whyTutor: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.university) newErrors.university = 'University is required';
    if (!formData.major) newErrors.major = 'Major is required';
    if (!formData.gpa) newErrors.gpa = 'GPA is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'Select at least one subject';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (formData.availability.length === 0) newErrors.availability = 'Select at least one availability';
    if (!formData.whyTutor) newErrors.whyTutor = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit application
      console.log('Submitting application:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/tutor-application-success');
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
    'Economics',
    'Psychology',
    'Other'
  ];

  const availabilityOptions = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings'
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tutor Application</h1>
        <p className="text-gray-600">
          Please fill out the form below to apply as a tutor. We'll review your application and get back to you within 3-5 business days.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 ${
                  errors.university ? 'border-red-500' : ''
                }`}
              />
              {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
            </div>
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                Major
              </label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 ${
                  errors.major ? 'border-red-500' : ''
                }`}
              />
              {errors.major && <p className="mt-1 text-sm text-red-600">{errors.major}</p>}
            </div>
            <div>
              <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
                Current GPA
              </label>
              <input
                type="text"
                id="gpa"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 ${
                  errors.gpa ? 'border-red-500' : ''
                }`}
              />
              {errors.gpa && <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>}
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subjects</h2>
          <p className="text-sm text-gray-500 mb-4">Select the subjects you're qualified to tutor:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div key={subject} className="flex items-center">
                <input
                  type="checkbox"
                  id={subject}
                  name="subjects"
                  value={subject}
                  checked={formData.subjects.includes(subject)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor={subject} className="ml-2 text-sm text-gray-700">
                  {subject}
                </label>
              </div>
            ))}
          </div>
          {errors.subjects && <p className="mt-2 text-sm text-red-600">{errors.subjects}</p>}
        </div>

        {/* Experience */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Experience</h2>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Teaching/Tutoring Experience
            </label>
            <textarea
              id="experience"
              name="experience"
              rows={4}
              value={formData.experience}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 ${
                errors.experience ? 'border-red-500' : ''
              }`}
              placeholder="Describe your previous teaching or tutoring experience..."
            />
            {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Availability</h2>
          <p className="text-sm text-gray-500 mb-4">Select your available tutoring times:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availabilityOptions.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={option}
                  name="availability"
                  value={option}
                  checked={formData.availability.includes(option)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor={option} className="ml-2 text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
          {errors.availability && <p className="mt-2 text-sm text-red-600">{errors.availability}</p>}
        </div>

        {/* Why Tutor */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Do You Want to Tutor?</h2>
          <div>
            <textarea
              id="whyTutor"
              name="whyTutor"
              rows={4}
              value={formData.whyTutor}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring-primary-600 ${
                errors.whyTutor ? 'border-red-500' : ''
              }`}
              placeholder="Tell us why you want to become a tutor..."
            />
            {errors.whyTutor && <p className="mt-1 text-sm text-red-600">{errors.whyTutor}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg 
                       hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
} 