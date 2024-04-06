import { Typography } from "@mui/material";

const NotFound = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h1">404 - Not Found</Typography>
        <Typography variant="body1">The page you are looking for does not exist.</Typography>
      </div>
    </div>
  );
};

export default NotFound;