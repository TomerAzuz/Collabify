import { TextField, InputAdornment } from "@mui/material";
import { Search } from '@mui/icons-material';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField 
      label="Search documents..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      fullWidth
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
  )
};

export default SearchBar;