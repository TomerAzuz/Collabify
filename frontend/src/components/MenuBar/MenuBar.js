import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import html2pdf from 'html2pdf.js';

import './MenuBar.css';
import ShareDoc from './ShareDoc';
import serialize from '../Serializers/serializer';
//import RevisionHistory from '../Revisions/RevisionHistory';

const MenuBar = ({ doc, user }) => {
  const navigate = useNavigate();
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState(null);
  const [viewMenuAnchorEl, setViewMenuAnchorEl] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);

  const handleFileMenuOpen = (event) => {
    setFileMenuAnchorEl(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchorEl(null);
  };

  const handleEditMenuOpen = (event) => {
    setEditMenuAnchorEl(event.currentTarget);
  };

  const handleEditMenuClose = () => {
    setEditMenuAnchorEl(null);
  };

  const handleViewMenuOpen = (event) => {
    setViewMenuAnchorEl(event.currentTarget);
  };

  const handleViewMenuClose = () => {
    setViewMenuAnchorEl(null);
  };

  // const serialize = (value) => {
  //   return value.map((n) => Node.string(n)).join('\n');
  // };

  const saveAsPDF = () => {
    handleFileMenuClose();
    const filename = doc.title || 'document';
    const opt = {
      margin:       0.8,
      filename:     `${filename}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    console.log(doc.content);
    const content = doc.content.map(node => serialize(node)).join('');
    console.log(content);
    html2pdf().from(content).set(opt).save();
  };

  const saveAsRichTextDocument = () => {
    handleFileMenuClose();
    const content = serialize(doc.content);
    const blob = new Blob([content], { type: 'text/richtext' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title || 'document'}.rtf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const saveAsPlainText = () => {
    handleFileMenuClose();
    const content = serialize(doc.content);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppBar position="static" sx={{ width: '100%', flexGrow: 0 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 0, cursor: 'pointer' }} 
          onClick={() => navigate('/dashboard')}
        >
          {doc?.title}
        </Typography>
        <div style={{ marginLeft: '60px' }}> 
          <Button
            color="inherit"
            aria-controls="file-menu"
            aria-haspopup="true"
            onClick={handleFileMenuOpen}
          >
            File
          </Button>
          <Menu
            id="file-menu"
            anchorEl={fileMenuAnchorEl}
            open={Boolean(fileMenuAnchorEl)}
            onClose={handleFileMenuClose}
          >
            <MenuItem onClick={handleFileMenuClose}>New</MenuItem>
            <MenuItem onClick={handleFileMenuClose}>Open</MenuItem>
            <MenuItem onClick={handleFileMenuClose}>Save</MenuItem>
            <Menu
              id="download-menu"
              anchorEl={downloadAnchorEl}
              open={Boolean(downloadAnchorEl)}
              onClose={() => setDownloadAnchorEl(false)}
            >
              Download
              <MenuItem onClick={saveAsPDF}>PDF document (.pdf)</MenuItem>
              <MenuItem onClick={saveAsRichTextDocument}>Rich text format (.rtf)</MenuItem>
              <MenuItem onClick={saveAsPlainText}>Plain text (.txt)</MenuItem>
            </Menu>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Details</MenuItem>
            <MenuItem>Print</MenuItem>
          </Menu>
          <Button
            color="inherit"
            aria-controls="edit-menu"
            aria-haspopup="true"
            onClick={handleEditMenuOpen}
          >
            Edit
          </Button>
          <Menu
            id="edit-menu"
            anchorEl={editMenuAnchorEl}
            open={Boolean(editMenuAnchorEl)}
            onClose={handleEditMenuClose}
          >
            <MenuItem onClick={handleEditMenuClose}>Undo</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Redo</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Cut</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Copy</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Paste</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Select all</MenuItem>
          </Menu>
          <Button
            color="inherit"
            aria-controls="view-menu"
            aria-haspopup="true"
            onClick={handleViewMenuOpen}
          >
            View
          </Button>
          <Menu
            id="view-menu"
            anchorEl={viewMenuAnchorEl}
            open={Boolean(viewMenuAnchorEl)}
            onClose={handleViewMenuClose}
          >
            <MenuItem onClick={handleViewMenuClose}>Zoom In</MenuItem>
            <MenuItem onClick={handleViewMenuClose}>Zoom Out</MenuItem>
            <MenuItem onClick={handleViewMenuClose}>Full Screen</MenuItem>
          </Menu>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          {/* <RevisionHistory editor={editor} doc={doc} /> */}
          <ShareDoc doc={doc} user={user} />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
