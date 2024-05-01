import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Link } from "@mui/material";

import './ErrorPage.css';

const ErrorPage = ({ code }) => {
  const navigate = useNavigate();
  const { errorCode } = useParams();

  const actualErrorCode = parseInt(errorCode || code, 10);

  let errorMessage;
  switch (actualErrorCode) {
    case 404:
      errorMessage = "The page you are looking for does not exist.";
      break;
    case 500:
      errorMessage = "Internal Server Error. Please try again later.";
      break;
    default:
      errorMessage = "An error occurred.";
      break;
  }

  return (
    <div className='error-message'>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h1">{actualErrorCode} Error</Typography>
        <Typography gutterBottom variant="body1">{errorMessage}</Typography>
        <Link 
          component="button"
          variant="h5"
          sx={{ margin: 4 }}
          underline="hover"
          onClick={() => navigate('/dashboard') }  
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
