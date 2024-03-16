import React, { useNavigate } from 'react-router-dom';
import DocumentsGrid from './DocumentsGrid';
import { Add, ExitToApp } from '@mui/icons-material';
import { Typography, Button, Card } from '@mui/material';

import '../../App.css';
import './Dashboard.css';
import blankTemplate from '../Templates/blankTemplate';
import { postData } from '../../apiService';
import { useAuth } from '../Auth/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, handleSignOut } = useAuth();

  const createDocument = async (e) => {
    e.preventDefault();
    
    try {
      const document = {
        title: 'untitled document',
        content: blankTemplate(),
        previewUrl: '',
      };
      const response = await postData('documents', document);
      navigate(`/document/${response.id}`, {
        state: { document: response }
      });
      console.log('Document created successfully:', response);
    } catch (error) {
      console.log('Error creating document:', error);
    }   
  };

  return (
    <div className='home-container'>
      <div className='header'>
        Hello, {user.displayName || user.email}
        <div className='card-container'>
          <Card
            sx={{
              width: 150,
              height: 200,
              alignItems: 'center',
              '&:hover': {
                border: '1px solid #2196f3',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                boxSizing: 'border-box'
              }
            }}
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
      <Button
          variant="contained"
          startIcon={<ExitToApp />}
          onClick={handleSignOut}
        >
          Log out
        </Button>
      <DocumentsGrid />
    </div>
  )
};

export default Dashboard;
