import { TextField, Grid } from '@mui/material';
const FormField = ({ field }) => {
  return (
    <Grid item xs={12}>
      <TextField
        variant='outlined'
        label={field.label}
        name={field.name}
        type={field.type}
        value={field.value}
        autoComplete={field.name}
        onChange={field.onChange}
        InputProps={{
          startAdornment: field.icon,
        }}
      />
    </Grid>
  );
};

export default FormField;