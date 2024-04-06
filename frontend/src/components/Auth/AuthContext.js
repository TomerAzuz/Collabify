import React, { useEffect, createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, 
        EmailAuthProvider,
        createUserWithEmailAndPassword, 
        updateProfile,
        signInWithEmailAndPassword, 
        GoogleAuthProvider, 
        signInWithPopup,
        signOut,
        getIdToken, 
        GithubAuthProvider,
        reauthenticateWithCredential } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

import Loader from '../Common/Loader/Loader';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuthentication = async(e, action, formData) => {
    e.preventDefault();
    try {
      setLoading(true);
      let userCredential;

      switch (action) {
        case 'register':
          userCredential = await register(formData);
          break;
        case 'email':
          userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          break;
        case 'google':
          userCredential = await signInWithPopup(auth, googleProvider);
          break;
        case 'github':
          userCredential = await signInWithPopup(auth, githubProvider);
          break;
        default:
          throw new Error('Invalid action');
      }

      userCredential && navigate("/dashboard");
    } catch (error) {
      console.error(error.message);
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false)
    }
  };
  
  const handleSignOut = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigate("/");
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async(formData) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, { displayName: formData.displayName });
      return userCredential;
    } catch (error) {
      console.error('Registration failed:', error.message);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulSignIn = useCallback(async (currentUser) => {
    try {
      setLoading(true);
      // Fetch the id token 
      const token = await getIdToken(currentUser);
      // Set the authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(currentUser);
    } catch (error) {
      console.error('Sign in failed:', error.message);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const handleReauthentication = async (password) => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error('User not found.');
      }
      const credential = EmailAuthProvider.credential(user.email, password);
      return await reauthenticateWithCredential(auth.currentUser, credential);
    } catch (error) {
      console.error('Reauthentication failed:', error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const refreshUserToken = async () => {
      if (user) {
        try {
          const refreshedUser = await user.getIdTokenResult(true);
          setUser(refreshedUser);
        } catch (error) {
          console.error('Token refresh failed:', error.message);
        }
      }
    };
  
    // Refresh token every hour
    const interval = setInterval(refreshUserToken, 3600000); 
  
    return () => clearInterval(interval);
  }, [user]);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      currentUser ? handleSuccessfulSignIn(currentUser) : 
                    handleSignOut();  
    });
    return () => unsubscribe();
  }, [handleSignOut, handleSuccessfulSignIn]);

  return (
    <AuthContext.Provider value={{ user,
                                   handleAuthentication,
                                   handleReauthentication,
                                   handleSignOut, 
                                   getIdToken,
                                   error
                                }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};