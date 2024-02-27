import React, { useState } from 'react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import LinkIcon from '@mui/icons-material/Link';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DOMPurify from 'dompurify';

import '../../App.css';
import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';

const InsertImage = ({ editor }) => {
  const [anchorEl, setAnchorEl] = useState(null);

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
    if (!file)  {
      return;
    }
    console.log(file.type);
    if (imageExtensions.includes(file.type))  {
      const url = URL.createObjectURL(file);
      CustomEditor.insertImage(editor, url);
    } else {
      alert('Please select a valid image file.');
    }
  };

  return (
    <>
      <Tooltip title="Insert image">
        <IconButton onClick={handleMenuOpen}>
          <InsertPhotoIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="insert-image-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component="label" htmlFor="imageUpload">
        <FileUploadIcon style={{ marginRight: '8px' }} />
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
          <LinkIcon style={{ marginRight: '8px' }} />
          By URL
        </MenuItem>
      </Menu>
    </>
  );
};

export default InsertImage;
