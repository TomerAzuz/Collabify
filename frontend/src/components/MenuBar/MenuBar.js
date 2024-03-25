import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Node } from 'slate';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import html2pdf from 'html2pdf.js';

import './MenuBar.css';
import ShareDoc from './ShareDoc';

const MenuBar = ({ doc, user }) => {
  const navigate = useNavigate();
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState(null);
  const [viewMenuAnchorEl, setViewMenuAnchorEl] = useState(null);

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

  const serialize = (value) => {
    return value.map((n) => Node.string(n)).join('\n');
  };

  const handleSaveAsPDF = () => {
    handleFileMenuClose();
    const filename = doc.title || 'document';
    const opt = {
      margin:       0.5,
      filename:     `${filename}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    const content = serialize(doc.content);
    console.log(content);
    html2pdf().from(content).set(opt).save();
  };

  const handleSaveAsRichTextDocument = () => {
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

const handleSaveAsPlainText = () => {
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
      <Toolbar sx ={{ }}>
        <Typography 
          variant="h6" 
          sx={{ flexGrow: 0, cursor: 'pointer' }} 
          onClick={() => navigate('/dashboard')}
        >
          {doc && doc.title}
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
            <MenuItem>Download</MenuItem>
            <MenuItem onClick={handleSaveAsPDF}>PDF document (.pdf)</MenuItem>
            <MenuItem onClick={handleSaveAsRichTextDocument}>Rich text format (.rtf)</MenuItem>
            <MenuItem onClick={handleSaveAsPlainText}>Plain text (.txt)</MenuItem>
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
        <ShareDoc doc={doc} user={user} />
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
