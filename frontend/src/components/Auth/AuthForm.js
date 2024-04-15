import React from 'react';
import { Button, Grid, Typography, Card, Container, CardContent, CardHeader, Alert } from '@mui/material';

import './LoginPage.css';
import { useAuth } from './AuthContext';
import FormField from './FormField';
import LoginMethodButtons from './LoginMethodButtons';

const AuthForm = ({ title, 
                    formFields, 
                    errors, 
                    buttonText, 
                    handleSubmit,
                    additionalElement
                  }) => {
                    
  const { error } = useAuth();
  return (
    <Container className="login-page">
      <Card className='login-paper' elevation={2}>
        <CardHeader
            title={title}
            titleTypographyProps={{ 
              variant: 'h4', 
              textAlign: 'center', 
              fontWeight: 'bold' 
            }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && 
                <Alert 
                  sx={{ marginBottom: '15px' }} 
                  severity="error">{error}
                </Alert>
              } 
              <Grid container spacing={2} align="center">
                {formFields.map((field) => (
                  <FormField 
                    key={field.name} 
                    field={field} 
                    error={errors[field.name]} 
                  />
                ))}
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  type='submit'
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#ffffff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#388e3c',
                    },
                  }}
                >
                  {buttonText}
                </Button>
                {additionalElement}
              </Grid>
              <Grid item xs={12}>
                <div className="lineAround">
                  <Typography variant='paragraph' align='center' gutterBottom>
                    OR
                  </Typography>
                </div>
              </Grid>
              <LoginMethodButtons />
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AuthForm;