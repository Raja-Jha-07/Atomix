import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock } from '@mui/icons-material';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Lock sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom color="error">
              403
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleGoBack}
              sx={{ minWidth: 120 }}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              onClick={handleGoHome}
              sx={{ minWidth: 120 }}
            >
              Go Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UnauthorizedPage; 