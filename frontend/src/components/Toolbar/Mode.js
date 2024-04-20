import { Divider, Select, IconButton, Tooltip, MenuItem } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';

const Mode = ({ mode, setMode }) => {

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  return (
    <>
      <Divider sx={{ margin: '10px' }} orientation="vertical" variant="middle" flexItem />
      <Tooltip title={`${mode} mode`}>
        <Select
          value={mode}
          onChange={handleModeChange}
          sx={{
            width: '120px',
            height: '50px',
            padding: '0px 0px', 
            boxShadow: 'none', 
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
            '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':  { border: 0 },
            '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 0 },
            '& .MuiSelect-select': {
              fontWeight: 'thin', 
            },
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
    </>
  );
};

export default Mode;