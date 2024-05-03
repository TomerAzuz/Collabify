import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css';
import { AuthProvider } from './components/Auth/AuthContext';
import PrivateRoute from './components/Routes/PrivateRoute';
import CustomRoute from './components/Routes/CustomRoute';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import PasswordResetPage from './components/Auth/PasswordResetPage';
import Page from './components/Editor/Page';
import LandingPage from './components/LandingPage/LandingPage';
import ProfilePage from './components/Profile/ProfilePage';
import ErrorPage from './components/ErrorPage/ErrorPage.js';

const App = () => (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster />
          <Routes>
            <Route path="/" element={<CustomRoute component={LandingPage} />} />
            <Route path="/auth/login" element={<CustomRoute component={<LoginPage />} />} />
            <Route path="/auth/signup" element={<CustomRoute component={<SignupPage />} />} />
            <Route path="/auth/forgot" element={<CustomRoute component={<PasswordResetPage/>} />} />
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/profile/:uid" element={<PrivateRoute component={ProfilePage}/>}/>
            <Route path="/document/:id" element={<PrivateRoute component={Page} />} />
            <Route path="*" element={<ErrorPage errorCode={404} />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
);

export default App;