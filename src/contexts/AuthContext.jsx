// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import app from '../Firebae/Firebase__config__';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Configure Google provider
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Save user to backend
  const saveUserToBackend = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to save user to database');
      }

      return result.user;
    } catch (error) {
      console.error('Error saving user to backend:', error);
      throw error;
    }
  };

  // Get user from backend
  const getUserFromBackend = async (uid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${uid}`);
      const result = await response.json();

      if (result.success) {
        return result.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user from backend:', error);
      return null;
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, userData) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with additional data
      if (userData) {
        await updateProfile(user, {
          displayName: userData.fullName,
          photoURL: userData.photoURL
        });
      }

      // Prepare user data for backend
      const backendUserData = {
        uid: user.uid,
        email: user.email,
        displayName: userData?.fullName || '',
        photoURL: userData?.photoURL || '',
        location: userData?.location || '',
        profession: userData?.profession || '',
        userType: userData?.userType || '',
        package: userData?.package || 'Basic',
        createdAt: new Date().toISOString(),


      };

      // Save user to backend
      const savedUser = await saveUserToBackend(backendUserData);
      setUserProfile(savedUser);

      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const logIn = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user profile from backend
      const userProfile = await getUserFromBackend(userCredential.user.uid);
      setUserProfile(userProfile);

      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Prepare user data for backend
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        package: 'Basic',
        packageExpiry: null,
        createdAt: new Date().toISOString(),
      };

      // Save/update user in backend
      const savedUser = await saveUserToBackend(userData);
      setUserProfile(savedUser);

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
      setUserProfile(null);
      setUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Clear error
  const clearError = () => setError('');

  // Update user profile
  const updateUserProfile = async (uid, updateData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        setUserProfile(result.user);
        return result.user;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user profile from backend
        const userProfile = await getUserFromBackend(currentUser.uid);
        setUserProfile(userProfile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    user,
    userProfile,
    signUp,
    logIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
    error,
    clearError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};