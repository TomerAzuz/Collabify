import React, { useMemo } from 'react';
import { Grid } from '@mui/material';

import templates from './templates.json';
import TemplateCard from './TemplateCard.js';

const TemplatesGrid = () => {

  const templateCards = useMemo(() => [
    {
      id: 0,
      title: 'Blank document',
      content: templates.blank.content,
    }, {
      id: 1,
      title: 'Resume',
      content: templates.resume.content,
      previewUrl: "https://collabify-images.s3.il-central-1.amazonaws.com/4f660e2f-bcc6-4fa2-903d-518021518062.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240414T154115Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Credential=AKIAXBQHZG3RC3YIN3KO%2F20240414%2Fil-central-1%2Fs3%2Faws4_request&X-Amz-Signature=7d8cba9c63c9a18038b05102e2973558a9ac6a84073d21e2c4bd70e8731da93c"
    }, {
      id: 2,
      title: 'Letter',
      content: templates.letter.content,
      previewUrl: "https://collabify-images.s3.il-central-1.amazonaws.com/2a63bfc4-5b26-4117-85fb-8cb4d2eff1db.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240414T153903Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Credential=AKIAXBQHZG3RC3YIN3KO%2F20240414%2Fil-central-1%2Fs3%2Faws4_request&X-Amz-Signature=ca30520cfc4302d123517690fa66fed79a4bd345920eaf52676612d758c64fb3"
    }
  ], []);

  return (
    <Grid 
      container spacing={2} 
      sx={{ justifyContent: 'center' }}
    >
      {templateCards.map((template) => (
        <TemplateCard 
          key={template.id}
          template={template}
        />
      ))}
    </Grid>
  );
};

export default TemplatesGrid;