import React, { useState } from 'react';
import { IconButton, Menu } from '@mui/material';
import { MoreVert, TextFields, Delete, OpenInNew } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import './DocumentMenu.css';
import { useAuth } from '../../../../AuthContext';
import { updateDocument } from '../../../../services/documentService';
import DeleteDialog from '../../../Dialogs/DeleteDocumentDialog';
import RenameDialog from '../../../Dialogs/RenameDocumentDialog';
import CustomMenuItem from './CustomMenuItem';

const DocumentMenu = ({
  document,
  anchorEl,
  setAnchorEl,
  onDeleteDocument,
  onTitleUpdate,
}) => {
  const { user } = useAuth();
  const [editedTitle, setEditedTitle] = useState(document.title || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const isOwner = user.uid === document.createdBy.uid;

  const deleteDocument = async () => {
    let loadingToastId;
    try {
      loadingToastId = toast.loading('Deleting document...');
      await onDeleteDocument(document);
      toast.success(`Deleted '${document.title}'`, { id: loadingToastId });
    } catch (error) {
      toast.error('Error deleting document: ', error, { id: loadingToastId });
    }
  };

  const updateDocumentTitle = async () => {
    let loadingToastId;
    if (document.createdBy.uid === user.uid) {
      try {
        loadingToastId = toast.loading('Updating title...');
        const updatedDoc = await updateDocument(document.id, {
          title: editedTitle,
        });
        onTitleUpdate(updatedDoc.title);
        toast.success('Document title updated', { id: loadingToastId });
      } catch (error) {
        toast.error('Error updating document title', { id: loadingToastId });
      }
    }
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

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const menuItems = [
    {
      title: 'Rename',
      onClick: () => handleRenameItemClick(),
      icon: TextFields,
    },
    {
      title: 'Remove',
      onClick: () => handleDeleteItemClick(),
      icon: Delete,
    },
    {
      title: 'Open in a new tab',
      onClick: () => handleOpenInNewTab(),
      icon: OpenInNew,
    },
  ];

  return (
    <>
      <IconButton aria-label="more" onClick={handleMenuClick}>
        <MoreVert />
      </IconButton>
      <Menu
        id="item-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems.map((item, index) => (
          <CustomMenuItem
            key={index}
            item={item}
            onClick={item.onClick}
            icon={item.icon}
          />
        ))}
      </Menu>
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
    </>
  );
};

export default DocumentMenu;
