import React, { useState } from 'react';
import { useSlate } from 'slate-react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { VideoLibrary } from '@mui/icons-material';

import useCustomEditor from '../../hooks/useCustomEditor';

const InsertEmbed = () => {
  const editor = useSlate();
  const { insertVideo } = useCustomEditor();
  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInsertVideo = () => {
    insertVideo(editor, videoUrl);
    handleClose();
  };

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value);
  };

  return (
    <>
      <Tooltip title="Insert video">
        <IconButton onClick={handleOpen}>
          <VideoLibrary />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Insert Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="video-url"
            label="Video URL"
            fullWidth
            value={videoUrl}
            onChange={handleInputChange}
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleInsertVideo}>Insert</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InsertEmbed;
