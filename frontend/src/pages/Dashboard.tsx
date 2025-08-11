import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  alpha,
  useTheme,
  IconButton,
  Stack,
  Paper,
  CardActions,
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
  Payment,
  TrendingDown,
  ArrowForward,
  Refresh,
  Notifications,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();

  // Get food card balance from Redux state (persisted locally)
  const foodCardBalance = user?.foodCardBalance || 0;

  // Admin/Manager Stats
  const adminStats = [
    {
      title: 'Total Orders',
      value: '1,234',
      icon: <ShoppingCart />,
      color: 'primary',
      change: '+12%',
      isIncrease: true,
      description: 'Compared to last month',
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    {
      title: 'Revenue',
      value: '₹45,678',
      icon: <TrendingUp />,
      color: 'success',
      change: '+8%',
      isIncrease: true,
      description: 'Monthly revenue',
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    },
    {
      title: 'Active Users',
      value: '156',
      icon: <Person />,
      color: 'info',
      change: '+15%',
      isIncrease: true,
      description: 'Registered users',
      gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
    },
    {
      title: 'Menu Items',
      value: '78',
      icon: <Restaurant />,
      color: 'warning',
      change: '+3%',
      isIncrease: true,
      description: 'Available items',
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
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
      action: 'Recharge',
      actionPath: '/payments',
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    },
    {
      title: 'Orders This Month',
      value: '12',
      icon: <ShoppingCart />,
      color: 'success',
      description: 'Total orders placed',
      action: 'View Orders',
      actionPath: '/orders',
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    },
    {
      title: 'Favorite Vendor',
      value: 'Cafe Delight',
      icon: <Restaurant />,
      color: 'info',
      description: 'Most ordered from',
      action: 'Browse Menu',
      actionPath: '/menu',
      gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
    },
    {
      title: 'Average Spend',
      value: '₹85',
      icon: <Payment />,
      color: 'warning',
      description: 'Per order average',
      action: 'View Analytics',
      actionPath: '/analytics',
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
    },
  ];

  const quickActions = [
    {
      title: 'Browse Menu',
      description: 'Explore today\'s fresh offerings',
      icon: <Restaurant />,
      path: '/menu',
      color: theme.palette.primary.main,
      badge: 'Hot',
    },
    {
      title: 'Order History',
      description: 'View your past orders',
      icon: <History />,
      path: '/orders',
      color: theme.palette.info.main,
    },
    {
      title: 'Recharge Card',
      description: 'Top up your food card',
      icon: <Add />,
      path: '/payments',
      color: theme.palette.success.main,
    },
    {
      title: 'Profile Settings',
      description: 'Update your preferences',
      icon: <Person />,
      path: '/profile',
      color: theme.palette.secondary.main,
    },
  ];

  const recentActivity = [
    {
      title: 'Lunch order from Spice Garden',
      time: '2 hours ago',
      amount: '₹250',
      status: 'delivered',
      icon: <Fastfood />,
    },
    {
      title: 'Food card recharged',
      time: '1 day ago',
      amount: '₹500',
      status: 'completed',
      icon: <AccountBalance />,
    },
    {
      title: 'Breakfast order from Cafe Delight',
      time: '2 days ago',
      amount: '₹120',
      status: 'delivered',
      icon: <Fastfood />,
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

  const StatCard = ({ stat, isAdmin = false }: { stat: any; isAdmin?: boolean }) => (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          background: stat.gradient,
          opacity: 0.1,
          borderRadius: '0 0 0 100%',
        }}
      />
      
      <CardContent sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ 
              fontWeight: 600, 
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {stat.title}
            </Typography>
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              color: theme.palette.text.primary,
              mt: 1,
              mb: 0.5,
            }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.description}
            </Typography>
          </Box>
          
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: stat.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {stat.icon}
          </Box>
        </Box>

        {isAdmin && stat.change && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={stat.isIncrease ? <TrendingUp sx={{ fontSize: '1rem' }} /> : <TrendingDown sx={{ fontSize: '1rem' }} />}
              label={stat.change}
              size="small"
              sx={{
                backgroundColor: stat.isIncrease 
                  ? alpha(theme.palette.success.main, 0.1)
                  : alpha(theme.palette.error.main, 0.1),
                color: stat.isIncrease ? theme.palette.success.main : theme.palette.error.main,
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'inherit',
                },
              }}
            />
          </Box>
        )}

        {!isAdmin && stat.action && (
          <CardActions sx={{ p: 0, mt: 2 }}>
            <Button
              size="small"
              onClick={() => navigate(stat.actionPath)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: theme.palette.primary.main,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.08),
                },
              }}
              endIcon={<ArrowForward sx={{ fontSize: '1rem' }} />}
            >
              {stat.action}
            </Button>
          </CardActions>
        )}
      </CardContent>
    </Card>
  );

  const renderEmployeeDashboard = () => (
    <>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.firstName}! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              {getRoleWelcomeMessage()}
            </Typography>
          </Box>
          <IconButton
            onClick={() => window.location.reload()}
            sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
        
        <Box sx={{ mb: 2 }}/>

      </Box>

      {/* Employee Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {employeeStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Quick Actions
              </Typography>
              <Chip label="New" size="small" color="primary" />
            </Box>
            
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: alpha(action.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: action.color,
                          }}
                        >
                          {action.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {action.title}
                            </Typography>
                            {action.badge && (
                              <Chip 
                                label={action.badge} 
                                size="small" 
                                sx={{ 
                                  height: 18, 
                                  fontSize: '0.65rem',
                                  backgroundColor: theme.palette.error.main,
                                  color: 'white',
                                }} 
                              />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                        <ArrowForward sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recent Activity
              </Typography>
              <IconButton size="small">
                <Notifications />
              </IconButton>
            </Box>

            <Stack spacing={2}>
              {recentActivity.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.background.default, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {activity.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {activity.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {activity.amount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {getRoleWelcomeMessage()}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          Monitor and manage your cafeteria operations
        </Typography>
      </Box>

      {/* Admin Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {adminStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard stat={stat} isAdmin />
          </Grid>
        ))}
      </Grid>

      {/* Management Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Management Tools
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Person />}
                  onClick={() => navigate('/analytics')}
                  sx={{ py: 2, textTransform: 'none' }}
                >
                  User Management
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Restaurant />}
                  onClick={() => navigate('/menu')}
                  sx={{ py: 2, textTransform: 'none' }}
                >
                  Menu Management
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={() => navigate('/orders')}
                  sx={{ py: 2, textTransform: 'none' }}
                >
                  Order Management
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<TrendingUp />}
                  onClick={() => navigate('/analytics')}
                  sx={{ py: 2, textTransform: 'none' }}
                >
                  Analytics & Reports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              System Status
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Server Status
                </Typography>
                <Chip label="Operational" color="success" size="small" />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Payment Gateway
                </Typography>
                <Chip label="Connected" color="success" size="small" />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Database
                </Typography>
                <Chip label="Healthy" color="success" size="small" />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      {user?.role === 'EMPLOYEE' ? renderEmployeeDashboard() : renderAdminDashboard()}
    </Box>
  );
};

export default Dashboard; 