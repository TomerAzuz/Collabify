import { Typography, Link } from "@mui/material";

import './Logo.css';

const Logo = ({ variant }) => {
 return (
    <Link href="/dashboard" underline="none" color="inherit">
      <Typography variant={variant} style={{ fontFamily: 'inheirt' }}>
        <span className="logo">Collabify</span>
      </Typography>
    </Link>
 );
};

export default Logo;