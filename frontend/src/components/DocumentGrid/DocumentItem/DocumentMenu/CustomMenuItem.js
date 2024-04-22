import React from 'react';
import { MenuItem, Typography } from '@mui/material';

import './DocumentMenu.css';

const CustomMenuItem = ({ item, onClick, icon: Icon }) => (
  <MenuItem onClick={onClick} className='menu-item'>
    <Icon fontSize='large' />
    <Typography 
      fontSize='large' 
      sx={{ marginLeft: '10px', marginRight: '10px' }} 
    >
      {item.title}
    </Typography>
  </MenuItem>
);

export default CustomMenuItem;