import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import { AuthProvider } from './components/Auth/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './components/Auth/LoginPage';
import Signup from './components/Auth/SignupForm';
import NotFound from './components/ErrorPages/NotFound';
import Page from './components/Editor/Page';
import LandingPage from './components/LandingPage/LandingPage';

const App = () => (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/document/:id" element={<PrivateRoute component={Page} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
);

export default App;