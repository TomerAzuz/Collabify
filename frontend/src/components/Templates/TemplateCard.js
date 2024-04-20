import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Card, CardMedia } from '@mui/material';

import './Templates.css';
import useDocumentFunctions from '../CustomHooks/useDocumentFunctions.js';

const TemplateCard = ({ template }) => {
  const { createDocument } = useDocumentFunctions();
  const navigate = useNavigate();
  
  const handleCreateDocument = async () => {
    try {
      const response = await createDocument(template.content, template.title);
      if (response) {
        navigate(`/document/${response.id}`, {
          state: { doc: response }
        });
      }
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  return (
    <Grid item>
      <Card
        className='template'
        onClick={() => handleCreateDocument()}
      >
        {template.previewUrl && (
          <CardMedia 
            component="img"
            image={template.previewUrl}
            sx={{ height: 260, width: 180 }}
        />
        )}
      </Card>
      <Typography variant="body1" align='center' sx={{ marginTop: '10px' }}>
        {template.title}
      </Typography>
    </Grid>
  )
};

export default TemplateCard;