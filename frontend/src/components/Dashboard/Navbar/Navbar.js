import React from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@mui/material';
import { AccountCircle, ExitToApp } from '@mui/icons-material';

import './Navbar.css';
import { useAuth } from '../../Auth/AuthContext';
import SearchBar from './SearchBar';
import Logo from '../../Common/Logo/Logo';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const { user, handleSignOut } = useAuth();

  return (
    <AppBar>
      <Toolbar sx={{ backgroundColor: '#f5f5f5' }}>
        <Logo variant={'h3'}/>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <IconButton
          color="black"
          aria-label="user-profile"
          sx={{
            '&:hover': {
              borderRadius: '10px', 
            },
          }}
          onClick={() => navigate(`/profile/${user.uid}`)}
        >
          {user.photoURL ? 
            <Avatar src={user.photoURL} 
                    alt="Profile" 
                    fontSize='large'
                    sx={{ marginRight: '5px' }} 
            /> :
            <AccountCircle fontSize='large' sx={{ marginRight: '5px' }} />
          }
          <Typography variant="body1" sx={{ marginRight: '5px' }}>
            {user.displayName || user.email}
          </Typography>
        </IconButton>
        <IconButton
          sx={{
            '&:hover': {
              borderRadius: '10px', 
            },
          }}
          aria-label="logout"
          onClick={handleSignOut}
        >
          <ExitToApp fontSize='medium' sx={{ marginRight: '5px' }} />
          <Typography variant="body1">
            Log out
          </Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;