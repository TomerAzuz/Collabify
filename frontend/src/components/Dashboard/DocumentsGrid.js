import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import { fetchData, deleteData } from '../../apiService';
import DocumentItem from './DocumentItem';
import './Dashboard.css';

const DocumentsGrid = () => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Content is not needed
  useEffect(() => {
    async function getDocuments() {
      try {
        const response = await fetchData('documents');
        setDocuments(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getDocuments();
  }, []);

  const handleDeleteDocument = async (documentId) => {
    try {
      await deleteData('documents', documentId);
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Grid container spacing={2} sx={{ padding: '16px' }}>
      {documents && documents?.map((document) => (
        <Grid item key={document.id}>
          <DocumentItem 
            document={document} 
            onDeleteDocument={handleDeleteDocument} 
          />
      </Grid>
    ))}
    </Grid>
  )
};

export default DocumentsGrid;