import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';

const CustomIconButton = ({ title, onClick, icon }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Tooltip title={title}>
      <IconButton
        className={isActive ? 'button active' : 'button'}
        onClick={() => {
          onClick();
          setIsActive(!isActive);
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default CustomIconButton;