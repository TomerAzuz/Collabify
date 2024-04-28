import { TextField } from "@mui/material";

import './ProfilePage.css';

const ProfileField = ({ formData, title, value, handleFormChange }) => (
  <TextField
    name={value}
    label={title}
    value={formData[value] || ''}
    type={value === 'password' ? 'password' : 'text'}
    onChange={handleFormChange}
    sx={{ width: '40%' }}
  />
);

export default ProfileField;
