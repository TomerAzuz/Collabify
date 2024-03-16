import React, { useState } from 'react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { InsertPhoto, Link, FileUpload } from '@mui/icons-material';
import DOMPurify from 'dompurify';

import '../../App.css';
import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';

const InsertImage = ({ editor }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  //const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const isImageUrl = url => {
    if (!url || !isUrl(url)) {
      return false;
    }
    const ext = new URL(url).pathname.split('.').pop();
    return imageExtensions.includes(ext);
  };

  const handleURL = (e) => {
    e.preventDefault();
    const url = window.prompt('Enter the URL of the image:');
    const sanitizedUrl = DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    if (sanitizedUrl && !isImageUrl(sanitizedUrl))  {
      alert('URL is not an image');
      return;
    }
    sanitizedUrl && CustomEditor.insertImage(editor, sanitizedUrl);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // if (!imageExtensions.includes(file.type)) {
    //   alert('Please select a valid image file.');
    //   return;
    // }

    const maxSize = 1024 * 1024 * 5;
    if (file.size > maxSize) {
      alert('Image file size is too large. Please choose a file under 5MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    CustomEditor.insertImage(editor, url);
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
