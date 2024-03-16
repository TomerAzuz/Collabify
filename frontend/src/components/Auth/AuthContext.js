import React, { useEffect, createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, 
        createUserWithEmailAndPassword, 
        updateProfile,
        signInWithEmailAndPassword, 
        GoogleAuthProvider, 
        signInWithPopup,
        signOut,
        getIdToken, 
        GithubAuthProvider} from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { Snackbar } from '@mui/material';

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
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();

  const handleSnackbarClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMessage(null);
  };

  const handleAuthentication = async(e, action, formData) => {
    e.preventDefault();

    let userCredential;
    try {
      setLoading(true);

      switch (action) {
        case 'register':
          userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          await updateProfile(userCredential.user, {
            displayName: formData.displayName
          });
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
          break;
      }
      userCredential && navigate("/");

    } catch (error) {
      console.log('Authentication failed: ', error);
    } finally {
      setLoading(false)
    }
  };
  
  const signIn = async (method, ...args) => {
    try {
      switch (method) {
        case 'email':
          await signInWithEmailAndPassword(auth, ...args);
          break;
        case 'google':
          await signInWithPopup(auth, googleProvider);
          break;
        case 'github':
          await signInWithPopup(auth, githubProvider);
          break;
          default:
            setAlertMessage('Invalid sign in method');
      }   
    } catch (error) {
      setAlertMessage('Error signing in:', error.message);
    }
  };

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setAlertMessage('Error signing out:', error.message);
    }
  }, []);

  const register = async(email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAlertMessage('User registered successfully.');
    } catch (error) {
      setAlertMessage('Error registering:', error.message);
    }
  };

  const handleSuccessfulSignIn = useCallback(async (currentUser) => {
    // Fetch the id token 
    const token = await getIdToken(currentUser);
    // Set the authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(currentUser);
    setAlertMessage(`Hello, ${currentUser.displayName}!`);
  }, [setUser]);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      currentUser ? handleSuccessfulSignIn(currentUser) : 
                    handleSignOut();
      setLoading(false);      
    });
  
    return () => unsubscribe();
  }, [handleSignOut, handleSuccessfulSignIn]);

  return (
    <AuthContext.Provider value={{ user,
                                   signIn, 
                                   register,
                                   handleAuthentication,
                                   handleSignOut, 
                                   getIdToken
                                }}
    >
      {!loading && children}
      <Snackbar
        open={alertMessage !== null}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={alertMessage}
      />
    </AuthContext.Provider>
  );
};