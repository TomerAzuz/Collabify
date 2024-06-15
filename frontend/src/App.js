import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import CustomRoute from './routes/CustomRoute';
import Page from './components/Editor/Page';
import Dashboard from './pages/Dashboard/Dashboard.js';
import LoginPage from './pages/Login/LoginPage.js';
import SignupPage from './pages/Signup/SignupPage';
import PasswordResetPage from './pages/PasswordReset/PasswordResetPage';
import LandingPage from './pages/Landing/LandingPage';
import ProfilePage from './pages/Profile/ProfilePage.js';
import ErrorPage from './pages/ErrorPage/ErrorPage.js';

const App = () => (
  <Router>
    <AuthProvider>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/" element={<CustomRoute component={LandingPage} />} />
          <Route
            path="/auth/login"
            element={<CustomRoute component={LoginPage} />}
          />
          <Route
            path="/auth/signup"
            element={<CustomRoute component={SignupPage} />}
          />
          <Route
            path="/auth/forgot"
            element={<CustomRoute component={PasswordResetPage} />}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
          <Route
            path="/profile/:uid"
            element={<PrivateRoute component={ProfilePage} />}
          />
          <Route path="/document/:id" element={<Page />} />
          <Route path="*" element={<ErrorPage errorCode={404} />} />
        </Routes>
      </div>
    </AuthProvider>
  </Router>
);

export default App;
