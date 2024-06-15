import { TextField } from '@mui/material';

import './ProfilePage.css';

const ProfileField = ({ formData, field, handleFormChange }) => {
  const { value, title, autoComplete } = field;
  return (
    <form style={{ width: '25%', m: 0, p: 0 }}>
      <TextField
        name={value}
        label={title}
        value={formData[value] || ''}
        type={value === 'password' ? 'password' : 'text'}
        onChange={handleFormChange}
        autoComplete={autoComplete ? autoComplete : value}
      />
    </form>
  );
};

export default ProfileField;
