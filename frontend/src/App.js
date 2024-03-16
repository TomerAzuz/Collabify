import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container } from '@mui/material';
import './App.css';
import { AuthProvider } from './components/Auth/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './components/Auth/LoginPage';
import Signup from './components/Auth/SignupForm';
import NotFound from './components/ErrorPages/NotFound';
import Page from './components/Editor/Page';

const App = () => (
  <Container sx={{ 'display': 'flex' }}>
    <Router>
      <AuthProvider>
        <div className="App">
          <nav>
            <Link to="/">Home</Link>
          </nav>
          <Routes>
            <Route path="/" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/document/:id" element={<PrivateRoute component={Page} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  </Container>
);

export default App;