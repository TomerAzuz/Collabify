import { Box, Tooltip, Typography } from '@mui/material';

import '.././MenuBar.css';

const DocumentTitle = ({ title, updatedAt, isSaving }) => {
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
            sx={{
              fontWeight: 'bold',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title || 'Untitled document'}
          </Typography>
        </Tooltip>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ userSelect: 'none' }}
        >
          {isSaving ? 'Saving...' : `Last saved ${lastSaved}`}
        </Typography>
      </Box>
    </div>
  );
};

export default DocumentTitle;
