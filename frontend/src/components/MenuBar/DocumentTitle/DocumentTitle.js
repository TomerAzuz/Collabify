import { Box, Tooltip, Typography } from "@mui/material";

import '.././MenuBar.css';

const DocumentTitle = ({ title, updatedAt }) => {

  const lastSaved = new Date(updatedAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className="document-title">
      <Box>
        <Tooltip title={title || 'Document title'}>
          <Typography 
            variant="h6" 
            component="span" 
            sx={{ fontWeight: 'bold', userSelect: 'none' }}
          >
            {title || 'Untitled'}
          </Typography>
        </Tooltip>
        <Typography 
          variant="subtitle2" 
          color="textSecondary" 
          sx={{ userSelect: 'none' }}
        >
          Last saved {lastSaved}
        </Typography>
      </Box>
    </div>
  );
};

export default DocumentTitle;