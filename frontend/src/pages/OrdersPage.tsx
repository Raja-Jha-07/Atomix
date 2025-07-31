import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { Receipt, Refresh } from '@mui/icons-material';

const OrdersPage: React.FC = () => {
  const orders = [
    {
      id: 'ORD-001',
      items: [
        { name: 'Chicken Biryani', quantity: 1, price: 180 },
        { name: 'Masala Chai', quantity: 2, price: 25 },
      ],
      total: 230,
      status: 'PREPARING' as const,
      createdAt: '2024-01-15T12:30:00Z',
    },
    {
      id: 'ORD-002',
      items: [
        { name: 'Paneer Butter Masala', quantity: 1, price: 140 },
        { name: 'Dal Tadka', quantity: 1, price: 80 },
      ],
      total: 220,
      status: 'DELIVERED' as const,
      createdAt: '2024-01-14T13:15:00Z',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      case 'PREPARING':
        return 'primary';
      case 'READY':
        return 'success';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            My Orders
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Track your order history and current orders
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>

      {orders.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Placed on {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Chip
                    label={order.status.replace('_', ' ')}
                    color={getStatusColor(order.status) as any}
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <List dense>
                  {order.items.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                      <Typography variant="body2">
                        ₹{item.price * item.quantity}
                      </Typography>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Total: ₹{order.total}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {order.status === 'DELIVERED' && (
                      <Button variant="outlined" size="small">
                        Reorder
                      </Button>
                    )}
                    <Button variant="outlined" size="small">
                      View Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Receipt sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No orders yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start by browsing our menu and placing your first order
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            Browse Menu
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default OrdersPage; 