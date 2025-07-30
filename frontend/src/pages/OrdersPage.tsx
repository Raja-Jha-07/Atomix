import React from 'react';
import { Box, Typography } from '@mui/material';

const OrdersPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Typography variant="body1">
        Order history and active orders will be displayed here.
      </Typography>
    </Box>
  );
};

export default OrdersPage; 