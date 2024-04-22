import React, { useEffect, useState } from 'react';
import { Typography, Select, MenuItem, Box } from '@mui/material';

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

  const filteredDocuments = documents?.filter((document) => {
    if (filter === 'owned') {
      return document.createdBy.uid === user.uid;
    } else if (filter === 'collaborator') {
      return document.collaborators.some((collab) => collab.uid === user.uid);
    } else {
      return true;
    }
  }).filter((document) =>
    document.title.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className='container'>
        <div style={{ backgroundColor: '#F3F4F6', color: '#333', width: '100%', paddingTop: '120px', paddingBottom: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" align="center" mb={3} sx={{ color: '#555' }}>
            Start a new document
          </Typography>
          <TemplatesGrid />
        </div>
        <Box p={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ marginBottom: '12px', marginLeft: '32px', color: '#333' }}>
            My Documents
          </Typography>
          <div className="filter-container">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ marginRight: '32px' }}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="all">All Documents</MenuItem>
              <MenuItem value="owned">Owned by me</MenuItem>
              <MenuItem value="collaborator">Shared with me</MenuItem>
            </Select>
          </div>
        </Box>
        <DocumentsGrid documents={filteredDocuments} setDocuments={setDocuments} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
