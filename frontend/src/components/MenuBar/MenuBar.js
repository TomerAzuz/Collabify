import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ShareDoc from './ShareDoc';

import './MenuBar.css';
import { useAuth } from '../Auth/AuthContext';

const MenuBar = ({ doc, user }) => {
  const navigate = useNavigate();
  const { handleSignOut } = useAuth();
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState(null);
  const [viewMenuAnchorEl, setViewMenuAnchorEl] = useState(null);

  const handleFileMenuOpen = (event) => {
    setFileMenuAnchorEl(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchorEl(null);
  };

  const handleEditMenuOpen = (event) => {
    setEditMenuAnchorEl(event.currentTarget);
  };

  const handleEditMenuClose = () => {
    setEditMenuAnchorEl(null);
  };

  const handleViewMenuOpen = (event) => {
    setViewMenuAnchorEl(event.currentTarget);
  };

  const handleViewMenuClose = () => {
    setViewMenuAnchorEl(null);
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar sx={{ backgroundColor: 'black' }}>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 1, cursor: 'pointer' }} 
          onClick={() => navigate('/dashboard')}
        >
          Collabify
        </Typography>
        <Button
          color="inherit"
          aria-controls="file-menu"
          aria-haspopup="true"
          onClick={handleFileMenuOpen}
        >
          File
        </Button>
        <Menu
          id="file-menu"
          anchorEl={fileMenuAnchorEl}
          open={Boolean(fileMenuAnchorEl)}
          onClose={handleFileMenuClose}
        >
          <MenuItem onClick={handleFileMenuClose}>New</MenuItem>
          <MenuItem onClick={handleFileMenuClose}>Open</MenuItem>
          <MenuItem onClick={handleFileMenuClose}>Save</MenuItem>
        </Menu>
        <Button
          color="inherit"
          aria-controls="edit-menu"
          aria-haspopup="true"
          onClick={handleEditMenuOpen}
        >
          Edit
        </Button>
        <Menu
          id="edit-menu"
          anchorEl={editMenuAnchorEl}
          open={Boolean(editMenuAnchorEl)}
          onClose={handleEditMenuClose}
        >
          <MenuItem onClick={handleEditMenuClose}>Cut</MenuItem>
          <MenuItem onClick={handleEditMenuClose}>Copy</MenuItem>
          <MenuItem onClick={handleEditMenuClose}>Paste</MenuItem>
        </Menu>
        <Button
          color="inherit"
          aria-controls="view-menu"
          aria-haspopup="true"
          onClick={handleViewMenuOpen}
        >
          View
        </Button>
        <Menu
          id="view-menu"
          anchorEl={viewMenuAnchorEl}
          open={Boolean(viewMenuAnchorEl)}
          onClose={handleViewMenuClose}
        >
          <MenuItem onClick={handleViewMenuClose}>Zoom In</MenuItem>
          <MenuItem onClick={handleViewMenuClose}>Zoom Out</MenuItem>
          <MenuItem onClick={handleViewMenuClose}>Full Screen</MenuItem>
        </Menu>
        <ShareDoc doc={doc} user={user} />
        <Button
          color="inherit"
          startIcon={<ExitToApp />}
          onClick={handleSignOut}
        >
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
