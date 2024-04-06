import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography, TextField, 
         IconButton, Dialog, DialogTitle, DialogContent, DialogActions, 
         Button, Menu,  MenuItem } from '@mui/material';
import { Delete, MoreVert, TextFields, OpenInNew } from '@mui/icons-material';

import './DocumentItem.css';
import { useAuth } from '../Auth/AuthContext.js';
import { updateDocument } from '../Services/documentService.js';
import Loader from '../Common/Loader/Loader.js';

const DocumentItem = ({ document, onDeleteDocument }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editedTitle, setEditedTitle] = useState(document.title);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDocumentClick = () => {
    navigate(`/document/${document.id}`);
  };

  const deleteDocument = async () => {
    try {
      setLoading(true);
      await onDeleteDocument(document);
    } catch (error) {
      console.error('Error deleting document: ', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setLoading(false);
    }
  };

  const updateDocumentTitle = async () => {
    if (document.createdBy === user.uid) {
      const prevTitle = document.title;
      try {
        setLoading(true);
        await updateDocument(document.id, {
          title: editedTitle,
        });
        document.title = editedTitle;
      } catch (error) {
        console.error('Error updating document title:', error);
        document.title = prevTitle;
      } finally {
        setIsRenameDialogOpen(false);
        setLoading(false);
      }
    }
  }; 

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  
  const handleRenameItemClick = () => {
    setAnchorEl(null);
    setIsRenameDialogOpen(true);
  };

  const handleDeleteItemClick = () => {
    setAnchorEl(null);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenInTabClick = () => {
    setAnchorEl(null);
    window.open(`document/${document.id}`, '_blank'); 
  };

  return (
    <Grid item>
      <Card className='document-card'>
        {loading && <Loader />}
        <CardContent>
          <CardMedia 
            onClick={handleDocumentClick}
            className='card-media'
            component="img"
            image={document.previewUrl}
          />
          <div className='menu-container'>
            <IconButton aria-label='more' onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
            <Menu
              id="item-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleRenameItemClick} className='menu-item'>
                <TextFields fontSize='large' className='menu-item-icon' />
                Rename
              </MenuItem>
              <MenuItem onClick={handleDeleteItemClick} className='menu-item'>
                <Delete fontSize='large' className='menu-item-icon' />
                Remove
              </MenuItem>
              <MenuItem 
                className='menu-item'
                onClick={handleOpenInTabClick}
              >
                <OpenInNew fontSize="large" className='menu-item-icon'/>
                Open in a new tab
              </MenuItem>
            </Menu>
          </div>
          <Dialog 
            open={isDeleteDialogOpen} 
            onClose={() => setIsDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Document</DialogTitle>
            <DialogContent>
              Are you sure you want to permenanetly delete this document?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={deleteDocument}>Delete</Button>
            </DialogActions>
          </Dialog>
          <Dialog 
            open={isRenameDialogOpen} 
            onClose={() => setIsRenameDialogOpen(false)}
          >
            <DialogTitle>Rename</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography>
                Please enter a new name for the item:
              </Typography>
              <TextField 
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
              <Button onClick={updateDocumentTitle}>OK</Button>
            </DialogActions>
          </Dialog>
          <Typography
              variant='h6'
              className='card-title'
              onClick={handleDocumentClick}
          >
            {document.title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DocumentItem;