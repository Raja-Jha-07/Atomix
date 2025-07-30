import React from 'react';
import { Box, Typography } from '@mui/material';

const AnalyticsPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Typography variant="body1">
        Analytics and reports will be displayed here.
      </Typography>
    </Box>
  );
};

export default AnalyticsPage; 