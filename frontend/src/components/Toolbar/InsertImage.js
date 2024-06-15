import React, { useState } from 'react';
import { useSlate } from 'slate-react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { InsertPhoto, Link, FileUpload } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import '../../App.css';
import './Toolbar.css';
import { useAuth } from '../../AuthContext';
import useCustomEditor from '../../hooks/useCustomEditor';
import { postFile } from '../../services/s3Service';
import { isValidImageUrl, escapeFilename } from '../../utils/validation';
import Loader from '../Loader/Loader';

const cloudFrontDomain = process.env.REACT_APP_AWS_CLOUDFRONT_DOMAIN;

const InsertImage = () => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [open, setOpen] = useState(false);
  const editor = useSlate();
  const { insertImage } = useCustomEditor();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const isImageUrl = (url) => {
    if (!url || !isUrl(url) || !isValidImageUrl(url)) {
      return false;
    }
    const ext = new URL(url).pathname.split('.').pop();
    return imageExtensions.includes(ext);
  };

  const handleInsertImageUrl = () => {
    handleCloseDialog();
    handleMenuClose();
    if (!imageUrl || !isImageUrl(imageUrl)) {
      toast.error('URL is not an image');
      return;
    }
    insertImage(editor, imageUrl);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    handleMenuClose();

    const file = e.target.files[0];
    if (!file) return;

    const escapedName = escapeFilename(file.name);
    const filename = `${user.uid}:${escapedName}`;

    const maxSize = 1024 * 1024 * 5;
    if (file.size > maxSize) {
      toast.error(
        'Image file size is too large. Please choose a file under 5MB.'
      );
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please choose a valid image file (JPEG, PNG, GIF).');
      return;
    }

    try {
      setLoading(true);
      const userFile = new File([file], filename, { type: file.type });
      const response = await postFile(userFile);
      if (response.status === 201) {
        const imageUrl = `https://${cloudFrontDomain}.cloudfront.net/${filename}`;
        insertImage(editor, imageUrl);
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Insert image">
        <IconButton onClick={handleMenuOpen}>
          <InsertPhoto />
        </IconButton>
      </Tooltip>
      <Menu
        id="insert-image-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component="label" htmlFor="imageUpload">
          <FileUpload style={{ marginRight: '8px' }} />
          Upload from computer
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </MenuItem>
        <MenuItem onClick={handleOpenDialog}>
          <Link style={{ marginRight: '8px' }} />
          By URL
        </MenuItem>
      </Menu>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Insert Image by URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="image-url"
            label="Image URL"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleInsertImageUrl}>Insert</Button>
        </DialogActions>
      </Dialog>
      {loading && <Loader />}
    </>
  );
};

export default InsertImage;
