/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
      clearTimeout(timeout);
    });
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      if (!auth) throw new Error('Firebase not initialized. Please check your Firebase configuration.');
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  };

  const signup = async (email, password, name) => {
    setError(null);
    try {
      if (!auth) throw new Error('Firebase not initialized. Please check your Firebase configuration.');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      return result.user;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  };

  const googleLogin = async () => {
    setError(null);
    try {
      if (!auth) throw new Error('Firebase not initialized. Please check your Firebase configuration.');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      if (!auth) return;
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    try {
      if (!auth) throw new Error('Firebase not initialized.');
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated, login, signup, googleLogin, logout, resetPassword, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/configuration-not-found':
      return 'Authentication service is not enabled. Please enable Firebase Authentication in your Firebase Console.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/wrong-password':
      return 'Wrong password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked. Please allow pop-ups for this site.';
    default:
      return code ? `Authentication error: ${code}` : 'An unexpected error occurred.';
  }
}
