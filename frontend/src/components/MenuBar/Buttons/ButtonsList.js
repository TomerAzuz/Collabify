import { Tooltip, Switch } from "@mui/material";

import '.././MenuBar.css';
import MenuBarButton from './MenuBarButton.js';

const ButtonsList = ({ buttons, isAutosave, toggleAutosave }) => {

  return (
    <div className="buttons-list">
      {buttons.map((button, index) => (
        <MenuBarButton key={index} button={button} />
      ))}
      <Tooltip title='Autosave'>
        <Switch
          checked={isAutosave}
          onChange={(e) => toggleAutosave(e)}
          inputProps={{ "aria-label": 'Autosave' }}
        />
      </Tooltip>
    </div>
  );
};

export default ButtonsList;