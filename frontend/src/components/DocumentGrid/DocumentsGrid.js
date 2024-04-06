import React, { useCallback } from 'react';
import { Grid } from '@mui/material';

import './DocumentGrid.css';
import { useAuth } from '../Auth/AuthContext';
import Loader from '../Common/Loader/Loader';
import DocumentItem from '../DocumentItem/DocumentItem';
import { deleteDocument, updateDocument } from '../Services/documentService';

const DocumentsGrid = ({ documents, setDocuments, loading }) => {
  const { user } = useAuth();

const handleDeleteDocument = useCallback(async (document) => {
    try {
      if (document.createdBy === user.uid) {
        await deleteDocument(document.id);
      } else {
        await updateDocument(document.id, {
          collaborators: document.collaborators.filter(userId => userId !== user.uid)
        });
      } 
      setDocuments(documents => documents.filter(doc => doc.id !== document.id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }, [user, setDocuments]);

  return (
    <div className='grid-container'>
      {loading ? <Loader /> : 
        <Grid container spacing={3} sx={{ padding: '16px', margin: 'auto' }}>
          {documents?.map((doc, index) => (
              <DocumentItem 
                key={index}
                document={doc} 
                onDeleteDocument={handleDeleteDocument} 
              />
          ))}
        </Grid>
      }
    </div>
  );
};

export default React.memo(DocumentsGrid);