import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const PrivateRoute = ({ component: Component }) => {
  const { user } = useAuth();
  return user ? <Component /> : <Navigate to='/' />;
};

export default PrivateRoute;