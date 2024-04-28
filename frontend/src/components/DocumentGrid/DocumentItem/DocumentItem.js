import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';

import './DocumentItem.css';
import { useAuth } from '../../Auth/AuthContext.js';
import { updateDocument } from '../../Services/documentService.js';
import Loader from '../../Common/Loader/Loader.js';
import DeleteDialog from './DocumentDialogs/DeleteDialog.js';
import RenameDialog from './DocumentDialogs/RenameDialog.js';
import DocumentMenu from './DocumentMenu/DocumentMenu.js';

const DocumentItem = ({ document, onDeleteDocument }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editedTitle, setEditedTitle] = useState(document.title || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const isOwner = user.uid === document.createdBy.uid;

  const handleDocumentClick = () => {
    navigate(`/document/${document.id}`);
  };

  const deleteDocument = async () => {
    try {
      setLoading(true);
      await onDeleteDocument(document);
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Error deleting document: ', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setLoading(false);
    }
  };

  const updateDocumentTitle = async () => {
    if (document.createdBy.uid === user.uid) {
      const prevTitle = document.title;
      try {
        setLoading(true);
        await updateDocument(document.id, {
          title: editedTitle,
        });
        document.title = editedTitle;
        toast.success('Document title updated');
      } catch (error) {
        toast.error('Error updating document title:', error);
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
    setIsRenameDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteItemClick = () => {
    setIsDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  const handleOpenInNewTab = () => {
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
            sx={{ width: '100%', height: '240px' }}
            component="img"
            image={document.previewUrl || ''}
          />
          <DeleteDialog 
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            deleteDocument={deleteDocument}
            isOwner={isOwner}
          />
          <RenameDialog
            isRenameDialogOpen={isRenameDialogOpen}
            setIsRenameDialogOpen={setIsRenameDialogOpen}
            updateDocumentTitle={updateDocumentTitle}
            editedTitle={editedTitle}
            setEditedTitle={setEditedTitle}
          />
          <div className='document-card-footer'>
            <Typography
              variant='body1'
              onClick={handleDocumentClick}
              align="center"
              sx={{ 
                width: '100%',
                textAlign: 'center',
                marginLeft: '20px',
                textWrap: 'wrap',
                '&:hover': {
                  textDecoration: 'underline',
                }, 
              }}
            >
              {document.title}
            </Typography>
            <DocumentMenu 
              handleMenuClick={handleMenuClick}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              handleRenameItemClick={handleRenameItemClick}
              handleDeleteItemClick={handleDeleteItemClick}
              handleOpenInNewTab={handleOpenInNewTab}
            />
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DocumentItem;