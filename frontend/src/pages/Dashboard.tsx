import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Person,
  Restaurant,
  AccountBalance,
  History,
  Add,
  Fastfood,
  Schedule,
  Payment,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [foodCardBalance, setFoodCardBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Fetch food card balance for employees
  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.role === 'EMPLOYEE') {
        try {
          setLoading(true);
          const response = await paymentService.getFoodCardBalance();
          setFoodCardBalance(response.balance);
        } catch (error) {
          console.error('Failed to fetch food card balance:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBalance();
  }, [user]);

  // Admin/Manager Stats
  const adminStats = [
    {
      title: 'Total Orders',
      value: '1,234',
      icon: <ShoppingCart />,
      color: 'primary',
      change: '+12%',
      description: 'Compared to last month',
    },
    {
      title: 'Revenue',
      value: '₹45,678',
      icon: <TrendingUp />,
      color: 'success',
      change: '+8%',
      description: 'Monthly revenue',
    },
    {
      title: 'Active Users',
      value: '156',
      icon: <Person />,
      color: 'info',
      change: '+15%',
      description: 'Registered users',
    },
    {
      title: 'Menu Items',
      value: '78',
      icon: <Restaurant />,
      color: 'warning',
      change: '+3%',
      description: 'Available items',
    },
  ];

  // Employee Stats
  const employeeStats = [
    {
      title: 'Food Card Balance',
      value: `₹${foodCardBalance.toFixed(2)}`,
      icon: <AccountBalance />,
      color: 'primary',
      description: 'Available balance',
    },
    {
      title: 'Orders This Month',
      value: '12',
      icon: <ShoppingCart />,
      color: 'success',
      description: 'Total orders placed',
    },
    {
      title: 'Favorite Vendor',
      value: 'Cafe Delight',
      icon: <Restaurant />,
      color: 'info',
      description: 'Most ordered from',
    },
    {
      title: 'Average Spend',
      value: '₹85',
      icon: <Payment />,
      color: 'warning',
      description: 'Per order average',
    },
  ];

  const getRoleWelcomeMessage = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Admin Dashboard - Full System Overview';
      case 'CAFETERIA_MANAGER':
        return 'Manager Dashboard - Cafeteria Operations';
      case 'VENDOR':
        return 'Vendor Dashboard - Your Menu & Orders';
      case 'EMPLOYEE':
        return 'Welcome to Atomix Cafeteria';
      default:
        return 'Welcome to Atomix Cafeteria';
    }
  };

  const renderEmployeeDashboard = () => (
    <>
      {/* Employee Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {employeeStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.description}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: `${stat.color}.main`,
                      height: 56,
                      width: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions for Employees */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Fastfood />
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer', 
                      '&:hover': { backgroundColor: 'action.hover', borderColor: 'primary.main' },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => navigate('/menu')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Restaurant />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">Browse Menu</Typography>
                        <Typography variant="body2" color="textSecondary">
                          View today's menu and place orders
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer', 
                      '&:hover': { backgroundColor: 'action.hover', borderColor: 'success.main' },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => navigate('/orders')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <History />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">My Orders</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Track your order history and status
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer', 
                      '&:hover': { backgroundColor: 'action.hover', borderColor: 'info.main' },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => navigate('/profile')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <AccountBalance />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">Top Up Balance</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Add money to your food card
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer', 
                      '&:hover': { backgroundColor: 'action.hover', borderColor: 'warning.main' },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => navigate('/payments')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <Payment />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">Payment History</Typography>
                        <Typography variant="body2" color="textSecondary">
                          View all transactions and receipts
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Employee Account Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person />
                Your Account
              </Typography>
              {user && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 50, height: 50 }}>
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Chip
                        label="Employee"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  {user.department && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Department:</strong> {user.department}
                    </Typography>
                  )}
                  {user.floorId && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Floor:</strong> {user.floorId}
                    </Typography>
                  )}

                  {/* Food Card Balance Highlight */}
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.200' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        Food Card Balance
                      </Typography>
                      <AccountBalance color="primary" />
                    </Box>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      ₹{foodCardBalance.toFixed(2)}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<Add />}
                      sx={{ mt: 1 }}
                      onClick={() => navigate('/profile')}
                      fullWidth
                    >
                      Top Up Now
                    </Button>
                  </Box>

                  {/* Quick Tips */}
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      💡 <strong>Tip:</strong> Top up your food card for faster checkout!
                    </Typography>
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Specials */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule />
                Today's Specials
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="subtitle1" color="primary">Lunch Special</Typography>
                    <Typography variant="body2">Chicken Biryani + Raita</Typography>
                    <Typography variant="h6" color="success.main">₹120</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="subtitle1" color="primary">Healthy Choice</Typography>
                    <Typography variant="body2">Grilled Salad Bowl</Typography>
                    <Typography variant="h6" color="success.main">₹85</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="subtitle1" color="primary">Snack Deal</Typography>
                    <Typography variant="body2">Sandwich + Coffee</Typography>
                    <Typography variant="h6" color="success.main">₹65</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/menu')}
                startIcon={<Restaurant />}
              >
                View Full Menu
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      {/* Admin Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {adminStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                    {stat.change && (
                      <Chip
                        label={stat.change}
                        color={stat.color as any}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                    {stat.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {stat.description}
                      </Typography>
                    )}
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: `${stat.color}.main`,
                      height: 56,
                      width: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Admin Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card 
                    variant="outlined" 
                    sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    onClick={() => navigate('/analytics')}
                  >
                    <Typography variant="subtitle1">Analytics</Typography>
                    <Typography variant="body2" color="textSecondary">
                      View detailed reports and insights
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card 
                    variant="outlined" 
                    sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    onClick={() => navigate('/vendor-portal')}
                  >
                    <Typography variant="subtitle1">Vendor Management</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Manage vendors and menu items
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin User Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Account
              </Typography>
              {user && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Chip
                        label={user.role.replace('_', ' ')}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Email: {user.email}
                  </Typography>
                  {user.department && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Department: {user.department}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Employee-specific: Recent Orders */}
        {user?.role === 'EMPLOYEE' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Mock recent orders */}
                  {[
                    { id: 1, item: 'Veg Thali', vendor: 'North Indian Corner', time: '2 hours ago', amount: '₹120', status: 'Delivered' },
                    { id: 2, item: 'Masala Dosa', vendor: 'South Indian Express', time: 'Yesterday', amount: '₹80', status: 'Delivered' },
                    { id: 3, item: 'Paneer Roll', vendor: 'Street Food Hub', time: '2 days ago', amount: '₹90', status: 'Delivered' },
                  ].map((order) => (
                    <Box key={order.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Box>
                        <Typography variant="subtitle2">{order.item}</Typography>
                        <Typography variant="body2" color="textSecondary">{order.vendor} • {order.time}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle2">{order.amount}</Typography>
                        <Chip label={order.status} color="success" size="small" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {getRoleWelcomeMessage()}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {user ? `Welcome back, ${user.firstName}!` : 'Welcome to the dashboard'}
        </Typography>
      </Box>

      {user?.role === 'EMPLOYEE' ? renderEmployeeDashboard() : renderAdminDashboard()}
    </Box>
  );
};

export default Dashboard; 