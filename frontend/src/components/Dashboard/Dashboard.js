import React, { useEffect, useState } from 'react';
import { Typography, Select, MenuItem } from '@mui/material';

import './Dashboard.css';
import { getDocuments } from '../Services/documentService.js';
import { useAuth } from '../Auth/AuthContext';
import DocumentsGrid from '../DocumentGrid/DocumentsGrid';
import Navbar from './Navbar/Navbar.js';
import TemplatesGrid from '../Templates/TemplatesGrid.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filteredDocuments = documents?.filter(document => {
    if (filter === 'owned') {
      return document.createdBy.uid === user.uid;
    } else if (filter === 'collaborator') {
      return document.collaborators.some(collab => collab.uid === user.uid);
    } else {
      return true;
    }
  }).filter(document => 
      document.title.toLowerCase().startsWith(searchTerm.toLowerCase()));


  return (
    <>
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      <div className='dashboard-container'>
        <Typography variant="h6" align="center" sx={{ marginBottom: '30px' }}>
          Start a new document
        </Typography>
        <TemplatesGrid />
        <div className='my-documents'>
          <Typography variant="h5" sx={{ marginLeft: '100px' }}>
            My Documents
          </Typography>
          <Select
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            sx={{ minWidth: '200px', marginLeft: '60px' }}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            <MenuItem value="all">All Documents</MenuItem>
            <MenuItem value="owned">Owned by me</MenuItem>
            <MenuItem value="collaborator">Shared with me</MenuItem>
          </Select>
        </div>
        <DocumentsGrid 
          documents={filteredDocuments} 
          setDocuments={setDocuments}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Dashboard;