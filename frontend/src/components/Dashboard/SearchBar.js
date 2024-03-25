import { TextField, InputAdornment, Box } from "@mui/material";
import { Search } from '@mui/icons-material';

import './Dashboard.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <Box className='search-bar'>
      <TextField 
        placeholder="Search documents..."
        value={searchTerm}
        fullWidth
        onChange={e => setSearchTerm(e.target.value)}
        variant="outlined"
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
