import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const exampleTutors = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    subjects: ["Mathematics", "Physics"],
    gradeLevels: ["High School", "College"],
    bio: "Experienced math and physics tutor with 5 years of teaching experience. Specializes in calculus and mechanics.",
    rating: 4.8,
    availability: ["Monday", "Wednesday", "Friday"],
    sessionLength: "1 hour",
    learningStyle: "Visual and Hands-on",
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    subjects: ["Computer Science", "Mathematics"],
    gradeLevels: ["High School", "College"],
    bio: "Software engineer turned tutor. Passionate about teaching programming and problem-solving skills.",
    rating: 4.9,
    availability: ["Tuesday", "Thursday", "Saturday"],
    sessionLength: "1.5 hours",
    learningStyle: "Interactive and Project-based",
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    subjects: ["English", "History"],
    gradeLevels: ["Middle School", "High School"],
    bio: "Former high school teacher with expertise in literature and world history. Focuses on critical thinking and writing skills.",
    rating: 4.7,
    availability: ["Monday", "Wednesday", "Friday"],
    sessionLength: "1 hour",
    learningStyle: "Discussion-based",
    image: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    subjects: ["Chemistry", "Biology"],
    gradeLevels: ["High School", "College"],
    bio: "PhD in Biochemistry with a passion for teaching. Makes complex scientific concepts accessible and engaging.",
    rating: 4.9,
    availability: ["Tuesday", "Thursday", "Sunday"],
    sessionLength: "1.5 hours",
    learningStyle: "Visual and Experimental",
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    name: "Lisa Patel",
    email: "lisa.patel@example.com",
    subjects: ["Spanish", "French"],
    gradeLevels: ["Middle School", "High School", "College"],
    bio: "Native speaker with experience teaching multiple languages. Focuses on conversational skills and cultural understanding.",
    rating: 4.8,
    availability: ["Monday", "Wednesday", "Saturday"],
    sessionLength: "1 hour",
    learningStyle: "Conversational and Immersive",
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    subjects: ["Economics", "Business"],
    gradeLevels: ["High School", "College"],
    bio: "Former investment banker turned educator. Specializes in making economic concepts practical and relevant.",
    rating: 4.7,
    availability: ["Tuesday", "Thursday", "Sunday"],
    sessionLength: "1 hour",
    learningStyle: "Case Study-based",
    image: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    name: "Aisha Khan",
    email: "aisha.khan@example.com",
    subjects: ["Psychology", "Sociology"],
    gradeLevels: ["High School", "College"],
    bio: "Graduate student in Psychology with a focus on educational psychology. Makes complex theories accessible.",
    rating: 4.6,
    availability: ["Monday", "Wednesday", "Friday"],
    sessionLength: "1 hour",
    learningStyle: "Discussion and Application-based",
    image: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    subjects: ["Music Theory", "Piano"],
    gradeLevels: ["Elementary", "Middle School", "High School"],
    bio: "Professional musician and educator. Specializes in making music theory fun and accessible.",
    rating: 4.8,
    availability: ["Tuesday", "Thursday", "Saturday"],
    sessionLength: "1 hour",
    learningStyle: "Hands-on and Practical",
    image: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    subjects: ["Art History", "Studio Art"],
    gradeLevels: ["High School", "College"],
    bio: "Art historian and practicing artist. Combines historical context with practical art skills.",
    rating: 4.7,
    availability: ["Monday", "Wednesday", "Friday"],
    sessionLength: "1.5 hours",
    learningStyle: "Visual and Project-based",
    image: "https://randomuser.me/api/portraits/women/5.jpg"
  }
];

export default function SeedTutors() {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const seedTutors = async () => {
    if (!currentUser) {
      setStatus('You must be logged in to seed tutors.');
      return;
    }

    setIsLoading(true);
    setStatus('Seeding tutors...');
    
    try {
      // First, check if tutors already exist
      const tutorsCollection = collection(db, 'tutors');
      const existingTutors = await getDocs(tutorsCollection);
      
      if (!existingTutors.empty) {
        setStatus('Tutors already exist in the database. Please clear the collection first.');
        setIsLoading(false);
        return;
      }
      
      // Add each tutor to the database
      for (const tutor of exampleTutors) {
        await addDoc(tutorsCollection, {
          ...tutor,
          createdAt: new Date(),
          isAvailable: true,
          reviews: [],
          sessionsCompleted: 0,
          createdBy: currentUser.uid // Track who created the tutor
        });
      }
      
      setStatus('Successfully seeded 9 example tutors!');
    } catch (error) {
      console.error('Error seeding tutors:', error);
      setStatus(`Error seeding tutors: ${error.message}. Please check your Firebase permissions.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Access Denied</h1>
            <p className="text-gray-600">You must be logged in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Seed Example Tutors</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This will add 9 example tutors to your database with various subjects and specialties.
              Note: This action requires proper Firebase permissions.
            </p>
            <button
              onClick={seedTutors}
              disabled={isLoading}
              className={`w-full py-2 px-4 border border-transparent rounded-lg text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {isLoading ? 'Seeding...' : 'Seed Tutors'}
            </button>
          </div>

          {status && (
            <div className={`p-4 rounded-lg ${
              status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {status}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Example Tutors Preview</h2>
            <div className="space-y-4">
              {exampleTutors.map((tutor, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img src={tutor.image} alt={tutor.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h3 className="font-medium text-gray-900">{tutor.name}</h3>
                      <p className="text-sm text-gray-500">{tutor.subjects.join(', ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 