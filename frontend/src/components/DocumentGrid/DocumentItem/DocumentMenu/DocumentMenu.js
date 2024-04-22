import React from 'react';
import { IconButton, Menu } from '@mui/material';
import { MoreVert, TextFields, Delete, OpenInNew } from '@mui/icons-material';

import './DocumentMenu.css';
import CustomMenuItem from './CustomMenuItem';

const DocumentMenu = ({ handleMenuClick, anchorEl, setAnchorEl, handleRenameItemClick, handleDeleteItemClick, handleOpenInNewTab }) => {
  const menuItems = [
    {
      title: 'Rename',
      onClick: () => handleRenameItemClick(),
      icon: TextFields,
    },
    {
      title: 'Remove',
      onClick: () => handleDeleteItemClick(),
      icon: Delete,
    },
    {
      title: 'Open in a new tab',
      onClick: () => handleOpenInNewTab(),
      icon: OpenInNew,
    }
  ];
  
  return (
    <>
      <IconButton aria-label='more' onClick={handleMenuClick}>
        <MoreVert />
      </IconButton>
      <Menu
        id="item-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems.map((item, index) => (
          <CustomMenuItem 
            key={index} 
            item={item} 
            onClick={item.onClick}
            icon={item.icon} 
          />
        ))}
      </Menu>
    </>
  );
};

export default DocumentMenu;