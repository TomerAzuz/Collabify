import React, { useEffect, useState } from 'react';
import { Typography, Select, MenuItem } from '@mui/material';

import './Dashboard.css';
import { getDocuments } from '../Services/documentService.js';
import { useAuth } from '../Auth/AuthContext';
import DocumentsGrid from '../DocumentGrid/DocumentsGrid';
import DashboardAppBar from './DashboardAppBar.js';
import TemplatesGrid from '../Templates/TemplatesGrid.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState(null);
  const [filterOption, setFilterOption] = useState('all');
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
      <DashboardAppBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      <div className='dashboard-container'>
        <Typography sx={{ marginBottom: '30px' }}>
          Start a new document
        </Typography>
        <TemplatesGrid />
        <div className='my-documents'>
          <Typography variant="h5" >
            My Documents
          </Typography>
          <Select
            value={filterOption} 
            onChange={handleFilterChange} 
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