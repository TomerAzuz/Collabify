import React, { useEffect, useState } from 'react';
import { Typography, Select, MenuItem, Box } from '@mui/material';
import { toast } from 'react-hot-toast';

import './Dashboard.css';
import { useAuth } from '../../AuthContext';
import useDocumentFunctions from '../../hooks/useDocumentFunctions.js';
import Navbar from '../../components/Navbar/Navbar.js';
import DocumentsGrid from '../../components/DocumentGrid/DocumentsGrid.js';
import TemplatesGrid from '../../components/Templates/TemplatesGrid.js';

const Dashboard = () => {
  const { user } = useAuth();
  const { fetchDocuments } = useDocumentFunctions();
  const [documents, setDocuments] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDocs = async () => {
      try {
        const response = await fetchDocuments();
        setDocuments(response);
      } catch (error) {
        setError(error);
        toast.error('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    getDocs();
  }, []);

  const filteredDocuments = documents
    ?.filter((document) => {
      if (filter === 'owned') {
        return document.createdBy.uid === user.uid;
      } else if (filter === 'collaborator') {
        return document.collaborators.some((collab) => collab.uid === user.uid);
      } else {
        return true;
      }
    })
    .filter((document) =>
      document.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

  return (
    <div className="dashboard-container">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="container">
        <div className="top-section">
          <Typography variant="h6" align="center" mb={3} sx={{ color: '#555' }}>
            Start a new document
          </Typography>
          <TemplatesGrid />
        </div>
        <Box
          p={4}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h5"
            sx={{ marginBottom: '12px', marginLeft: '32px', color: '#333' }}
          >
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
        <DocumentsGrid
          documents={filteredDocuments}
          setDocuments={setDocuments}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Dashboard;
