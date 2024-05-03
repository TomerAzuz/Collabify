import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

import './Logo.css';

const Logo = ({ variant }) => {
  const navigate = useNavigate();

  return (
      <Typography 
        variant={variant} 
        sx={{ fontFamily: 'inheirt', cursor: 'pointer' }} 
        onClick={() => navigate('/dashboard')}
      >
        <span className="logo">Collabify</span>
      </Typography>
  );
};

export default Logo;