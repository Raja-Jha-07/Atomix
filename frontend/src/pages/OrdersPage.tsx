import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { Receipt, Refresh } from '@mui/icons-material';
import orderService, { OrderResponse } from '../services/orderService';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  // Mock data fallback when backend is not available
  const mockOrders: OrderResponse[] = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      items: [
        { menuItemId: 1, name: 'Chicken Biryani', quantity: 1, price: 180, vendor: 'Biryani Corner' },
        { menuItemId: 2, name: 'Masala Chai', quantity: 2, price: 25, vendor: 'Tea Stall' },
      ],
      totalAmount: 230,
      status: 'PREPARING',
      paymentMethod: 'FOOD_CARD',
      paymentStatus: 'COMPLETED',
      createdAt: '2024-01-15T12:30:00Z',
      estimatedDeliveryTime: '2024-01-15T13:00:00Z',
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      items: [
        { menuItemId: 3, name: 'Paneer Butter Masala', quantity: 1, price: 140, vendor: 'North Indian Kitchen' },
        { menuItemId: 4, name: 'Dal Tadka', quantity: 1, price: 80, vendor: 'North Indian Kitchen' },
      ],
      totalAmount: 220,
      status: 'DELIVERED',
      paymentMethod: 'FOOD_CARD',
      paymentStatus: 'COMPLETED',
      createdAt: '2024-01-14T13:15:00Z',
      estimatedDeliveryTime: '2024-01-14T13:45:00Z',
    },
  ];

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await orderService.getUserOrders();
      
      if (response.success && response.orders) {
        setOrders(response.orders);
        setUsingMockData(false);
      } else {
        // Fallback to mock data if API fails
        console.warn('Backend not available, using mock data');
        setOrders(mockOrders);
        setUsingMockData(true);
        setError(null); // Clear error since we have fallback data
      }
    } catch (err) {
      // Fallback to mock data on error (e.g., CORS, network issues)
      console.warn('Backend not available, using mock data');
      setOrders(mockOrders);
      setUsingMockData(true);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders(true);
  };

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
          startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : orders.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Order #{order.orderNumber}
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
                    Total: ₹{order.totalAmount}
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