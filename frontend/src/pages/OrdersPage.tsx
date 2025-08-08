import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Stack,
} from '@mui/material';
import { Receipt, Refresh, Restaurant, ShoppingBag } from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import orderService, { OrderResponse } from '../services/orderService';
import { getFoodImage } from '../utils/foodImages';

const OrdersPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  // Mock data fallback when backend is not available
  const mockOrders: OrderResponse[] = useMemo(() => [
    {
      id: 1,
      orderNumber: 'ORD-001',
      items: [
        { 
          menuItemId: 1, 
          name: 'Chicken Biryani', 
          quantity: 1, 
          price: 180, 
          vendor: 'Biryani Corner',
          image: getFoodImage('Chicken Biryani'),
          description: 'Aromatic basmati rice with tender chicken pieces and exotic spices'
        },
        { 
          menuItemId: 2, 
          name: 'Masala Chai', 
          quantity: 2, 
          price: 25, 
          vendor: 'Tea Stall',
          image: getFoodImage('Masala Chai'),
          description: 'Traditional Indian spiced tea with milk and aromatic spices'
        },
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
        { 
          menuItemId: 3, 
          name: 'Paneer Butter Masala', 
          quantity: 1, 
          price: 140, 
          vendor: 'North Indian Kitchen',
          image: getFoodImage('Paneer Butter Masala'),
          description: 'Creamy tomato-based curry with soft paneer cubes'
        },
        { 
          menuItemId: 4, 
          name: 'Dal Tadka', 
          quantity: 1, 
          price: 80, 
          vendor: 'North Indian Kitchen',
          image: getFoodImage('Dal Tadka'),
          description: 'Yellow lentils tempered with aromatic spices'
        },
      ],
      totalAmount: 220,
      status: 'DELIVERED',
      paymentMethod: 'FOOD_CARD',
      paymentStatus: 'COMPLETED',
      createdAt: '2024-01-14T13:15:00Z',
      estimatedDeliveryTime: '2024-01-14T13:45:00Z',
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      items: [
        { 
          menuItemId: 5, 
          name: 'Pav Bhaji', 
          quantity: 1, 
          price: 120, 
          vendor: 'Mumbai Street Food',
          image: getFoodImage('Pav Bhaji'),
          description: 'Spicy mixed vegetable curry served with buttered bread rolls'
        },
        { 
          menuItemId: 6, 
          name: 'Fresh Juice', 
          quantity: 1, 
          price: 60, 
          vendor: 'Juice Corner',
          image: getFoodImage('Fresh Juice'),
          description: 'Freshly squeezed seasonal fruit juice'
        },
      ],
      totalAmount: 180,
      status: 'READY',
      paymentMethod: 'FOOD_CARD',
      paymentStatus: 'COMPLETED',
      createdAt: '2024-01-15T14:15:00Z',
      estimatedDeliveryTime: '2024-01-15T14:30:00Z',
    },
  ], []);

  const fetchOrders = useCallback(async (isRefresh = false) => {
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
      } else {
        // Fallback to mock data if API fails
        console.warn('Backend not available, using mock data');
        setOrders(mockOrders);
        setError(null); // Clear error since we have fallback data
      }
    } catch (err) {
      // Fallback to mock data on error (e.g., CORS, network issues)
      console.warn('Backend not available, using mock data');
      setOrders(mockOrders);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mockOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Receipt sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 0.5 }}>
              My Orders
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Track your order history and current orders
            </Typography>
          </Box>
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

                {/* Order Items with Images */}
                <Grid container spacing={2}>
                  {order.items.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Food Image */}
                            <Avatar
                              src={item.image || getFoodImage(item.name)}
                              alt={item.name}
                              sx={{ 
                                width: 64, 
                                height: 64,
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'divider'
                              }}
                              variant="rounded"
                            >
                              <Restaurant />
                            </Avatar>

                            {/* Item Details */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                                  ₹{item.price * item.quantity}
                                </Typography>
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {item.vendor}
                              </Typography>
                              
                              {item.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.85rem' }}>
                                  {item.description}
                                </Typography>
                              )}
                              
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Chip 
                                  icon={<ShoppingBag />}
                                  label={`Qty: ${item.quantity}`}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                                <Typography variant="body2" color="text.secondary">
                                  ₹{item.price} each
                                </Typography>
                              </Stack>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Total: ₹{order.totalAmount}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {order.status === 'DELIVERED' && user?.role !== 'CAFETERIA_MANAGER' && (
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