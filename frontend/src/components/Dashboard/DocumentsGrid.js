import { Grid } from '@mui/material';

import './Dashboard.css';
import DocumentItem from './DocumentItem';
import { deleteData } from '../../apiService';

const DocumentsGrid = ({ documents, setDocuments }) => {
  const handleDeleteDocument = async (documentId) => {
    try {
      await deleteData('documents', documentId);
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div className='grid-container'>
      <Grid container spacing={3} sx={{ padding: '16px', margin: 'auto' }}>
        {documents?.map((document) => (
            <DocumentItem 
              key={document.id}
              document={document} 
              onDeleteDocument={handleDeleteDocument} 
            />
        ))}
      </Grid>
    </div>
  );
};

export default DocumentsGrid;