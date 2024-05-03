import React, { useCallback } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';

import { useAuth } from '../Auth/AuthContext';
import Loader from '../Common/Loader/Loader';
import DocumentItem from './DocumentItem/DocumentItem.js';
import { deleteDocument } from '../Services/documentService';

const DocumentsGrid = ({ documents, setDocuments, loading, error }) => {
  const { user } = useAuth();

  const handleDeleteDocument = useCallback(async (document) => {
    try {
      await deleteDocument(document.id);
      setDocuments(documents => documents.filter(doc => doc.id !== document.id));
    } catch (error) {
      toast.error('Error deleting document');
    }
  }, [user, setDocuments]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid 
      maxWidth='lg' 
      container spacing={3} 
      sx={{ margin: 'auto', paddingBottom: '30px'}}
    >
    {documents?.length > 0 ? (
      documents.map((doc) => (
        <DocumentItem 
          key={doc.id}
          document={doc} 
          onDeleteDocument={handleDeleteDocument} 
        /> 
      ))) : 
      (<Paper elevation={2} sx={{ padding: '30px', margin: 'auto' }}>
        <Typography gutterBottom align="center" variant='h6'>
          {error ? 'Error' : 'No text documents yet'}
        </Typography>
        <Typography gutterBottom align="center" variant='body2'>
          {error ? 'Failed to load documents. please try again.' : 
                   'Select a blank document or choose another template above to get started'}
        </Typography> 
      </Paper>
      )
    }
    </Grid>
  );
};

export default React.memo(DocumentsGrid);