import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Person,
  Restaurant,
  AccountBalanceWallet,
  Schedule,
  Favorite,
  LocalDining,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import RechargeDialog from '../components/payment/RechargeDialog';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Employee Personal Stats
  const employeeStats = [
    {
      title: 'Food Card Balance',
      value: `₹${user?.foodCardBalance?.toFixed(2) || '0.00'}`,
      icon: <AccountBalanceWallet />,
      color: 'primary',
      change: '',
      description: 'Available balance',
    },
    {
      title: 'Orders This Month',
      value: '23',
      icon: <ShoppingCart />,
      color: 'success',
      change: '+5',
      description: 'Total orders placed',
    },
    {
      title: 'Favorite Items',
      value: '5',
      icon: <Favorite />,
      color: 'error',
      change: '',
      description: 'Items in favorites',
    },
    {
      title: 'Avg Order Time',
      value: '15 min',
      icon: <Schedule />,
      color: 'info',
      change: '-2 min',
      description: 'Average wait time',
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

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'CAFETERIA_MANAGER';
  const statsToShow = isAdminOrManager ? adminStats : employeeStats;

  const handleRechargeSuccess = (amount: number) => {
    setSuccessMessage(`Successfully recharged ₹${amount.toFixed(2)} to your food card!`);
    // TODO: Update user balance in state/context
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {getRoleWelcomeMessage()}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {user ? `Welcome back, ${user.firstName}!` : 'Welcome to the dashboard'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {statsToShow.map((stat, index) => (
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

        {/* Role-specific Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {/* Employee Actions */}
                {user?.role === 'EMPLOYEE' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Card 
                        variant="outlined" 
                        sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                        onClick={() => navigate('/menu')}
                      >
                        <Typography variant="subtitle1">View Menu</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Browse today's menu and place orders
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card 
                        variant="outlined" 
                        sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                        onClick={() => navigate('/orders')}
                      >
                        <Typography variant="subtitle1">My Orders</Typography>
                        <Typography variant="body2" color="textSecondary">
                          View your order history and track current orders
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card 
                        variant="outlined" 
                        sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                        onClick={() => navigate('/payment')}
                      >
                        <Typography variant="subtitle1">Manage Payments</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Recharge food card and view transaction history
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                        <Typography variant="subtitle1">Favorites</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Quick order from your favorite items
                        </Typography>
                      </Card>
                    </Grid>
                  </>
                )}

                {/* Admin/Manager Actions */}
                {(user?.role === 'ADMIN' || user?.role === 'CAFETERIA_MANAGER') && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                        <Typography variant="subtitle1">Analytics</Typography>
                        <Typography variant="body2" color="textSecondary">
                          View detailed business analytics
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                        <Typography variant="subtitle1">Manage Users</Typography>
                        <Typography variant="body2" color="textSecondary">
                          User management and permissions
                        </Typography>
                      </Card>
                    </Grid>
                  </>
                )}

                {/* Vendor Actions */}
                {(user?.role === 'VENDOR' || user?.role === 'ADMIN' || user?.role === 'CAFETERIA_MANAGER') && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                      <Typography variant="subtitle1">Vendor Portal</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Manage your menu and orders
                      </Typography>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* User Info */}
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
                  {user.employeeId && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Employee ID: {user.employeeId}
                    </Typography>
                  )}
                  {user.foodCardBalance !== undefined && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'primary.main' }}>
                      <Typography variant="subtitle2" color="primary">Food Card Balance</Typography>
                      <Typography variant="h6" color="primary">
                        ₹{user.foodCardBalance.toFixed(2)}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mt: 1 }}
                        onClick={() => setRechargeDialogOpen(true)}
                      >
                        Recharge
                      </Button>
                    </Box>
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

      {/* Recharge Dialog */}
      <RechargeDialog
        open={rechargeDialogOpen}
        onClose={() => setRechargeDialogOpen(false)}
        onSuccess={handleRechargeSuccess}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 