import React, { useState } from 'react';
import { useSlate } from 'slate-react'
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { InsertPhoto, Link, FileUpload } from '@mui/icons-material';
import DOMPurify from 'dompurify';
import { toast } from 'react-hot-toast';

import '../../App.css';
import './Toolbar.css';
import useCustomEditor from '../CustomHooks/useCustomEditor';
import { postFile } from '../Services/s3Service';
import { isValidImageUrl } from '../Common/Utils/validation';

const InsertImage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const editor = useSlate();
  const { insertImage } = useCustomEditor();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const isImageUrl = url => {
    if (!url || !isUrl(url) || !isValidImageUrl(url)) {
      return false;
    }
    const ext = new URL(url).pathname.split('.').pop();
    return imageExtensions.includes(ext);
  };

  const handleURL = (e) => {
    e.preventDefault();
    handleMenuClose();
    const url = window.prompt('Enter the URL of the image:');
    const sanitizedUrl = DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    if (sanitizedUrl && !isImageUrl(sanitizedUrl))  {
      toast.error('URL is not an image');
      return;
    }
    sanitizedUrl && insertImage(editor, sanitizedUrl);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    handleMenuClose();
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 1024 * 1024 * 5;
    if (file.size > maxSize) {
      toast.error('Image file size is too large. Please choose a file under 5MB.');
      return;
    }
    try {
      const imageUrl = await postFile(file);
      insertImage(editor, imageUrl); 
    } catch (error) {
      toast.error('Failed to upload image');
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
        <MenuItem onClick={handleURL}>
          <Link style={{ marginRight: '8px' }} />
          By URL
        </MenuItem>
      </Menu>
    </>
  );
};

export default InsertImage;
