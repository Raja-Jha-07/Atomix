import React from 'react';
import { Box, Typography } from '@mui/material';

const VendorPortal: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Portal
      </Typography>
      <Typography variant="body1">
        Vendor management features will be displayed here.
      </Typography>
    </Box>
  );
};

export default VendorPortal; 