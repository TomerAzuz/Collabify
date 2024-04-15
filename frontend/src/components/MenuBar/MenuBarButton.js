import { IconButton, Tooltip } from "@mui/material";

const MenuBarButton = ({ button }) => {
  return (
    <Tooltip title={button.title}>
      <IconButton onClick={button.onClick}>
        {button.icon}
      </IconButton>
    </Tooltip>
  );
};

export default MenuBarButton;