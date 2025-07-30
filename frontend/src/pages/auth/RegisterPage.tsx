import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>
          <Typography variant="body1">
            Registration form will be implemented here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage; 