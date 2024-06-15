import React from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';

const DetailItem = ({ field, text }) => {
  return (
    <ListItem>
      <ListItemText
        primary={<Typography variant="body1">{`${field} ${text}`}</Typography>}
      />
    </ListItem>
  );
};

export default DetailItem;
