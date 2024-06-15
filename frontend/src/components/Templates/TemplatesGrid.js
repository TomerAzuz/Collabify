import React, { useMemo } from 'react';
import { Grid } from '@mui/material';

import templates from './templates.json';
import TemplateCard from './TemplateCard.js';

const cloudFrontDomain = process.env.REACT_APP_AWS_CLOUDFRONT_DOMAIN;

const TemplatesGrid = () => {
  const templateCards = useMemo(
    () => [
      {
        id: 0,
        title: 'Blank document',
        content: templates.blank.content,
      },
      {
        id: 1,
        title: 'Resume',
        content: templates.resume.content,
        previewUrl: `https://${cloudFrontDomain}.cloudfront.net/resume.jpg`,
      },
      {
        id: 2,
        title: 'Letter',
        content: templates.letter.content,
        previewUrl: `https://${cloudFrontDomain}.cloudfront.net/letter.jpg`,
      },
    ],
    []
  );

  return (
    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
      {templateCards.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </Grid>
  );
};

export default TemplatesGrid;
