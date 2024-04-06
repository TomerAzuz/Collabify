import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../Auth/AuthContext';

const CustomRoute = ({ component: Component }) => {
  const { user } = useAuth();
  return user ? <Navigate to='dashboard' /> : <Component /> 
};

export default CustomRoute;