import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { Typography, Button, Card, Select, MenuItem } from '@mui/material';

import './Dashboard.css';
import { postDocument, getDocuments } from '../Services/documentService.js';
import { useAuth } from '../Auth/AuthContext';
import DocumentsGrid from '../DocumentGrid/DocumentsGrid';
import blankTemplate from '../Templates/blankTemplate';
import DashboardAppBar from './DashboardAppBar.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [documents, setDocuments] = useState(null);
  const [filterOption, setFilterOption] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const fetchedDocuments = await getDocuments();
        setDocuments(fetchedDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const createDocument = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const document = {
        title: 'untitled document',
        content: blankTemplate(),
        previewUrl: '',
        permission: 'Viewer',
      };

      const response = await postDocument(document);
      navigate(`/document/${response.id}`);
    } catch (error) {
      console.error('Error creating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const filteredDocuments = documents?.filter(document => {
    if (filterOption === 'owned') {
      return document.createdBy === user.uid;
    } else if (filterOption === 'collaborator') {
      return document.collaborators.includes(user.uid);
    } else {
      return true;
    }
  }).filter(document => 
    document.title.toLowerCase().startsWith(searchTerm.toLowerCase()));

  return (
    <>
      <DashboardAppBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
          <div className='my-documents-header'>
          <Typography variant="h5" >
            My Documents
          </Typography>
          <Select
            value={filterOption}
            onChange={handleFilterChange}
            variant='outlined'
            sx ={{ minWidth: 120, marginTop: 5 }}
          >
            <MenuItem value="all">All Documents</MenuItem>
            <MenuItem value="owned">Owned by me</MenuItem>
            <MenuItem value="collaborator">Now owned by me</MenuItem>
          </Select>
        </div>
      </div>
      <DocumentsGrid 
        documents={filteredDocuments} 
        setDocuments={setDocuments} 
        loading={loading}
      />
    </div>
  </>
  )
};

export default Dashboard;
