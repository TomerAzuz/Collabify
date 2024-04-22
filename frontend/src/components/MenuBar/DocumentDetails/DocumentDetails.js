import React from 'react';
import { Paper, Typography, List, IconButton, Divider } from '@mui/material';
import { Close } from '@mui/icons-material'; 

import DetailItem from './DetailItem';

const DocumentDetails = ({ doc, setIsDetailsOpen }) => {

  const details = [
    {
      field: 'Owner:',
      text: doc.createdBy.displayName, 
    },
    {
      field: 'Modified:',
      text: `${new Date(doc.updatedAt).toLocaleString()}`,
    },
    {
      field: 'Created:',
      text: `${new Date(doc.createdAt).toLocaleString()}`,
    }
  ]
  return (
    <Paper 
      elevation={3} 
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: '40%',
        maxWidth: 600, 
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Document Details
      </Typography>
      <List>
        {details.map((detail, index) => (
          <React.Fragment key={index}>
            <DetailItem field={detail.field} text={detail.text} />
            {index !== details.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    <IconButton
      sx={{ position: 'absolute', top: 8, right: 8 }}
      onClick={() => setIsDetailsOpen(false)}
    >
      <Close />
    </IconButton>
  </Paper>
  )
};

export default DocumentDetails;