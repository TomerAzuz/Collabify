import React from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@mui/material';
import { AccountCircle, ExitToApp } from '@mui/icons-material';

import './DashboardAppBar.css';
import { useAuth } from '../Auth/AuthContext';
import SearchBar from './SearchBar';
import Logo from '../Common/Logo/Logo';

const DashboardAppBar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const { user, handleSignOut } = useAuth();

  return (
    <AppBar>
      <Toolbar sx={{ backgroundColor: '#f5f5f5' }}>
        <Logo variant={'h2'}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <IconButton
          color="black"
          aria-label="user-profile"
          onClick={() => navigate(`/profile/${user.uid}`)}
        >
          {user.photoURL ? 
            <Avatar src={user.photoURL} alt="Profile" sx={{ width: 30, height: 30, marginRight: '5px' }} />
            : <AccountCircle sx={{ marginRight: '5px' }} />
          }
          <Typography variant="body1" sx={{ marginRight: '5px' }}>
            {user.displayName || user.email}
          </Typography>
        </IconButton>
        
        <IconButton
          aria-label="logout"
          onClick={handleSignOut}
        >
          <ExitToApp sx={{ marginRight: '5px' }} />
          <Typography variant="body1">
            Log out
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardAppBar;
