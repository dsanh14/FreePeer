import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const googleProvider = new GoogleAuthProvider();

  async function signup(email, password, role = 'student') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      setUserRole(role);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login time
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      }, { merge: true });

      // Get user role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      }

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'student',
          createdAt: new Date(),
          onboardingCompleted: false
        });
        
        return { user, needsOnboarding: true };
      } else {
        // Check if onboarding is completed
        const userData = userDoc.data();
        return { user, needsOnboarding: !userData.onboardingCompleted };
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  function logout() {
    return signOut(auth);
  }

  function clearError() {
    setError(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    signInWithGoogle,
    logout,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 