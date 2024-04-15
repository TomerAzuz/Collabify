import { Select, IconButton, Tooltip, MenuItem } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';

const Mode = ({ mode, setMode }) => {

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  return (
    <Tooltip title={`${mode} mode`}>
      <Select
        value={mode}
        onChange={handleModeChange}
        sx={{
          maxWidth: '150px',
          maxHeight: '50px',
          padding: '0px 0px', 
        }}
        MenuProps={{
          disableScrollLock: true,
        }}
      >
        <MenuItem value="Editor">
          <IconButton
            sx={{
              padding: 0,
              marginRight: '6px',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            size="small"
          >
            <Edit sx={{ fontSize: 18 }} />
          </IconButton>
            <span style={{ fontSize: 14 }}>Editing</span>
        </MenuItem>
        <MenuItem value="Viewer">
          <IconButton 
            sx={{
              padding: 0,
              marginRight: '6px',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            size="small"
          >
            <Visibility sx={{ fontSize: 18 }}/>
          </IconButton>
          <span style={{ fontSize: 14 }}>Viewing</span>
        </MenuItem>
      </Select>
    </Tooltip>
  );
};

export default Mode;