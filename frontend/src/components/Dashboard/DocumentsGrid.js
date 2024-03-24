import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import './Dashboard.css';
import SearchBar from './SearchBar';
import DocumentItem from './DocumentItem';
import { fetchData, deleteData } from '../../apiService';

const DocumentsGrid = () => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDocuments = documents?.filter(document => 
    document.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Grid container spacing={2} sx={{ padding: '16px' }}>
        {filteredDocuments?.map((document) => (
          <Grid item key={document.id}>
            <DocumentItem 
              document={document} 
              onDeleteDocument={handleDeleteDocument} 
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DocumentsGrid;