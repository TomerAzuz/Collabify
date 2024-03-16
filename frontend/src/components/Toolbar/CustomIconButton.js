import { IconButton, Tooltip } from '@mui/material';

const CustomIconButton = ({ title, onClick, icon }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={() => {
          onClick();
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default CustomIconButton;