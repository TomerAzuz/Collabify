import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import { fetchData } from '../../apiService';
import DocumentItem from './DocumentItem';
import './Home.css';

const DocumentsGrid = () => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Should fetch documents by user id
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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Grid container spacing={1} sx={{ padding: '16px' }}>
      {documents?.map((document) => (
        <DocumentItem key={document.id} document={document}/>
    ))}
    </Grid>
  )
};

export default DocumentsGrid;