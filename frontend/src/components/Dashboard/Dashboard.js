import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add, ExitToApp } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, Button, Card } from '@mui/material';

import './Dashboard.css';
import { postData, fetchData } from '../../apiService';
import { useAuth } from '../Auth/AuthContext';
import DocumentsGrid from './DocumentsGrid';
import blankTemplate from '../Templates/blankTemplate';
import SearchBar from './SearchBar';


const Dashboard = () => {
  const navigate = useNavigate();
  const { handleSignOut } = useAuth();
  const [documents, setDocuments] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDocuments() {
      try {
        console.log("fetching documents");
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

  const filteredDocuments = documents?.filter(document => 
    document.title.toLowerCase().startsWith(searchTerm.toLowerCase()));

  return (
      <>
        <AppBar>
          <Toolbar sx={{ backgroundColor: '#f5f5f5', boxShadow: 'none' }}>
            <Typography variant="h3" style={{ fontFamily: 'Montserrat' }}>
              <span className="collabify-text">Collabify</span>
            </Typography>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Button
                startIcon={<ExitToApp />}
                onClick={handleSignOut}
              >
                Log out
            </Button>
          </Toolbar>
        </AppBar>
        <div className='dashboard-container'>
          <div className='card-container'>
            <Card
              className='template'
              onClick={e => createDocument(e)}
            >
            </Card>
          <Typography variant="body1" align='center' sx={{ marginTop: '10px' }}>
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
        <div>
          <Typography variant="h5" sx={{ marginTop: '20px' }}>My Documents</Typography>
        </div>
        <DocumentsGrid 
          documents={filteredDocuments} 
          setDocuments={setDocuments} 
        />
      </div>
    </>
  )
};

export default Dashboard;
