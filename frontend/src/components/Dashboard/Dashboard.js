import React, { useNavigate } from 'react-router-dom';
import DocumentsGrid from './DocumentsGrid';
import { Add } from '@mui/icons-material';
import { Typography, Button, Card } from '@mui/material';

import './Dashboard.css';
import blankTemplate from '../Templates/blankTemplate';
import { postData } from '../../apiService';
import { useAuth } from '../Auth/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const createDocument = async (e) => {
    e.preventDefault();
    
    try {
      const document = {
        title: 'untitled document',
        content: blankTemplate(),
        previewUrl: '',
        //collaborators: [],
        role: 'Viewer',
      };

      const response = await postData('documents', document);
      console.log(response);
      navigate(`/document/${response.id}`);
      console.log('Document created successfully:', response);
    } catch (error) {
      console.log('Error creating document:', error);
    }   
  };

  return (
    <div className='dashboard-container'>
      <div className='header'>
        <Typography className='user-greeting'>
          Hello, {user.displayName || user.email}
        </Typography>
        <div className='card-container'>
          <Card
            className='template'
            onClick={e => createDocument(e)}
          >
          </Card>
          <Typography variant="body1" align='center'>
            Blank document
          </Typography>
          <Button 
            variant='contained' 
            startIcon={<Add />} 
            className='create-doc-button'
            onClick={e => createDocument(e)}
          > 
            Create New Document
          </Button>
        </div>
      </div>
      <div className='section-header'>
        <Typography variant='h5'>Recent documents</Typography>
      </div>
      <DocumentsGrid />
    </div>
  )
};

export default Dashboard;
