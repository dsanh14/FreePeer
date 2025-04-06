import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name, role) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName: name,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // If user is a tutor, create tutor document
      if (role === 'tutor') {
        await setDoc(doc(db, 'tutors', user.uid), {
          displayName: name,
          subjects: [],
          gradeLevels: [],
          experience: 0,
          bio: '',
          availability: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Fetch the created user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      setUserData(userDoc.data());

      return user;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      return user;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          role: 'student', // Default role
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Fetch user data
      const updatedUserDoc = await getDoc(doc(db, 'users', user.uid));
      setUserData(updatedUserDoc.data());

      return user;
    } catch (error) {
      console.error('Error in Google sign in:', error);
      throw error;
    }
  }

  async function signInWithGithub() {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          role: 'student', // Default role
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Fetch user data
      const updatedUserDoc = await getDoc(doc(db, 'users', user.uid));
      setUserData(updatedUserDoc.data());

      return user;
    } catch (error) {
      console.error('Error in GitHub sign in:', error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user data when auth state changes
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    signInWithGoogle,
    signInWithGithub
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 