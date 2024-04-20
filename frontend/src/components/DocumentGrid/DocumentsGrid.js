import React, { useCallback } from 'react';
import { Grid, Paper, Typography } from '@mui/material';

import { useAuth } from '../Auth/AuthContext';
import Loader from '../Common/Loader/Loader';
import DocumentItem from './DocumentItem/DocumentItem.js';
import { deleteDocument, updateDocument } from '../Services/documentService';

const DocumentsGrid = ({ documents, setDocuments, loading }) => {
  const { user } = useAuth();

  const handleDeleteDocument = useCallback(async (document) => {
    try {
      if (document.createdBy.uid === user.uid) {
        await deleteDocument(document.id);
      } else {
        await updateDocument(document.id, {
          collaborators: document.collaborators
            .filter(collab => collab.uid !== user.uid)
        });
      } 
      setDocuments(documents => documents
          .filter(doc => doc.id !== document.id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }, [user, setDocuments]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid 
      maxWidth='md' 
      container spacing={3} 
      sx={{ margin: 'auto', 
            paddingBottom: '30px', 
            alignItems: 'center' 
      }}
    >
    {documents.length > 0 ? (
      documents.map((doc) => (
        <DocumentItem 
          key={doc.id}
          document={doc} 
          onDeleteDocument={handleDeleteDocument} 
        /> 
      ))) : 
      (<Paper elevation={2} sx={{ padding: '30px', margin: 'auto' }}>
        <Typography gutterBottom align="center" variant='h6'>
          No text documents yet
        </Typography>
        <Typography gutterBottom align="center" variant='body2'>
          Select a blank document or choose another template above to get started
        </Typography> 
      </Paper>
      )
    }
    </Grid>
  );
};

export default React.memo(DocumentsGrid);