import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Person,
  Restaurant,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Orders',
      value: '1,234',
      icon: <ShoppingCart />,
      color: 'primary',
      change: '+12%',
    },
    {
      title: 'Revenue',
      value: '₹45,678',
      icon: <TrendingUp />,
      color: 'success',
      change: '+8%',
    },
    {
      title: 'Active Users',
      value: '156',
      icon: <Person />,
      color: 'info',
      change: '+15%',
    },
    {
      title: 'Menu Items',
      value: '78',
      icon: <Restaurant />,
      color: 'warning',
      change: '+3%',
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
        return 'Employee Dashboard - Welcome to Atomix Cafeteria';
      default:
        return 'Welcome to Atomix Cafeteria';
    }
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
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.change}
                      color={stat.color as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
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

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <Typography variant="subtitle1">Browse Menu</Typography>
                    <Typography variant="body2" color="textSecondary">
                      View today's menu and place orders
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <Typography variant="subtitle1">View Orders</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Track your order history and status
                    </Typography>
                  </Card>
                </Grid>
                {(user?.role === 'ADMIN' || user?.role === 'CAFETERIA_MANAGER') && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                      <Typography variant="subtitle1">Analytics</Typography>
                      <Typography variant="body2" color="textSecondary">
                        View detailed reports and insights
                      </Typography>
                    </Card>
                  </Grid>
                )}
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
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
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
                  {user.foodCardBalance !== undefined && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Typography variant="subtitle2">Food Card Balance</Typography>
                      <Typography variant="h6" color="primary">
                        ₹{user.foodCardBalance.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 