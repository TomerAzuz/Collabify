import { Tooltip, Switch } from '@mui/material';
import MenuBarButton from './MenuBarButton.js';

const ButtonsList = ({ buttons, isAutosave, toggleAutosave }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    }}
  >
    {buttons.map((button, index) => (
      <MenuBarButton key={index} button={button} />
    ))}
    <Tooltip title="Autosave">
      <Switch
        checked={isAutosave}
        onChange={(e) => toggleAutosave(e)}
        inputProps={{ 'aria-label': 'Autosave' }}
      />
    </Tooltip>
  </div>
);

export default ButtonsList;
