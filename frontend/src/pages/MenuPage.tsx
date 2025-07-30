import React from 'react';
import { Box, Typography } from '@mui/material';

const MenuPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Menu
      </Typography>
      <Typography variant="body1">
        Menu items will be displayed here.
      </Typography>
    </Box>
  );
};

export default MenuPage; 