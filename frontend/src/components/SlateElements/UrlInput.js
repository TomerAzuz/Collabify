import { useState } from 'react';
import { TextField } from '@mui/material';

const UrlInput = ({ url, onChange }) => {
  const [value, setValue] = useState(url);
  return (
    <TextField
      variant="outlined"
      value={value}
      onClick={(e) => e.stopPropagation()}
      sx={{
        marginTop: '5px',
        boxSizing: 'border-box',
      }}
      onChange={(e) => {
        const newUrl = e.target.value;
        setValue(newUrl);
        onChange(newUrl);
      }}
    />
  );
};

export default UrlInput;
