import { Accordion, AccordionSummary, AccordionDetails, Avatar, Grid, Typography } from "@mui/material";
import { ExpandMore } from '@mui/icons-material';

import './ProfilePage.css';
import ProfileField from './ProfileField';
import SaveButton from "./SaveButton";

const ProfileSection = ({ formData, field, errors, handleFormChange, validateField }) => {
  return (
    <Accordion sx={{ marginTop: '10px', marginBottom: '10px', padding: '10px' }}>
      <AccordionSummary 
        expandIcon={<ExpandMore />} 
        aria-controls="panel-content" 
        id="panel-header"
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {field.title}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {field.subtitle && (
              <Typography variant="body1">
                {field.subtitle}
              </Typography>
            )}
          </Grid>
          <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {field.avatar && (
              <Avatar
                src={field.avatar}
                alt="Profile Picture"
                sx={{ 
                  width: '45px', 
                  height: '45px', 
                  marginRight: '20px' 
                }}
              />
            )}
          </Grid>
        </Grid>
      </AccordionSummary>
        <AccordionDetails>
          <div className="profile-field">
            <ProfileField 
              formData={formData}
              title={field.title}
              value={field.value}
              handleFormChange={handleFormChange}
            />
            <SaveButton validateField={(e) => validateField(e, field.value)} />
          </div>
          {errors[field.value] && (
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ color: 'error.main', marginTop: 1 }}
            >
              {errors[field.value]}
            </Typography>
            )}
          </AccordionDetails>
    </Accordion>
  )
};

export default ProfileSection;