import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

import './DocumentItem.css';
import DocumentMenu from './DocumentMenu/DocumentMenu.js';

const DocumentItem = ({ document, onDeleteDocument }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [documentTitle, setDocumentTitle] = useState(document.title || '');

  const handleDocumentClick = () => {
    navigate(`/document/${document.id}`);
  };

  const handleTitleUpdate = (newTitle) => {
    setDocumentTitle(newTitle);
  };

  return (
    <Grid item>
      <Card className="document-card">
        <CardContent className="card-content">
          <CardMedia
            onClick={handleDocumentClick}
            sx={{ width: '100%', height: '240px' }}
            component={document.previewUrl ? 'img' : ''}
            image={document.previewUrl || ''}
          />
          <div className="document-card-footer">
            <Typography
              variant="body1"
              onClick={handleDocumentClick}
              align="center"
              sx={{
                width: '100%',
                textAlign: 'center',
                marginLeft: '20px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {documentTitle}
            </Typography>
            <DocumentMenu
              document={document}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              onDeleteDocument={onDeleteDocument}
              onTitleUpdate={handleTitleUpdate}
            />
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DocumentItem;
