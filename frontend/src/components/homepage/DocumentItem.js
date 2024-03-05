import React, { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const DocumentItem = ({ document }) => {
  const navigate = useNavigate();

  const handleDocumentClick = () => {
    navigate(`/document/${document.id}`, {
      state: { document: document }
    });
  };
  
  return (
    <Grid item xs={3} onClick={handleDocumentClick}>
      <Card sx={{ maxWidth: 200, alignItems: 'center' }}>
        <CardMedia 
          component="img"
          image={document.previewUrl}
          alt="Preview"
          sx={{ width: '100%', height: '250px', objectFit: 'cover' }}
      />
        <CardContent>
          <Typography>{document.title}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DocumentItem;