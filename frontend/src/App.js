import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import { AuthProvider } from './components/Auth/AuthContext';
import PrivateRoute from './components/Routes/PrivateRoute';
import CustomRoute from './components/Routes/CustomRoute';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import NotFound from './components/ErrorPages/NotFound';
import Page from './components/Editor/Page';
import LandingPage from './components/LandingPage/LandingPage';
import ProfilePage from './components/UserProfile/ProfilePage';

const App = () => (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<CustomRoute component={LandingPage} />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/profile/:uid" element={<PrivateRoute component={ProfilePage}/>}/>
            <Route path="/document/:id" element={<PrivateRoute component={Page} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
);

export default App;