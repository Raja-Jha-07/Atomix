import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Google } from '@mui/icons-material';

const TestGoogleAuth: React.FC = () => {
  const handleGoogleLogin = () => {
    // Test the OAuth2 flow
    window.location.href = 'http://localhost:8080/api/v1/oauth2/authorization/google';
  };

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
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Test Google OAuth2
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Click the button below to test Google Sign-In integration
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            sx={{ mb: 2 }}
          >
            Test Google Sign-In
          </Button>
          <Typography variant="caption" display="block">
            This will redirect you to Google for authentication
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestGoogleAuth;
