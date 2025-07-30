import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  TrendingUp,
  People,
  Schedule,
  LocalDining,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {change && (
              <Typography variant="body2" color={color}>
                {change}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { color: `${color}.main` } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { cafeterias } = useAppSelector((state) => state.liveStatus);
  const { currentOrder } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch dashboard data
    // dispatch(fetchDashboardData());
  }, [dispatch]);

  const activeOrders = 12;
  const todayRevenue = 2450;
  const peopleCounting = cafeterias.reduce((total, cafeteria) => total + cafeteria.currentCapacity, 0);
  const cartItemsCount = currentOrder.length;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Here's what's happening at the cafeteria today
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={activeOrders}
            icon={<ShoppingCart />}
            color="primary"
            change="+12% from yesterday"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Revenue"
            value={`₹${todayRevenue}`}
            icon={<TrendingUp />}
            color="success"
            change="+8% from yesterday"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="People in Cafeterias"
            value={peopleCounting}
            icon={<People />}
            color="warning"
            change="Current count"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cart Items"
            value={cartItemsCount}
            icon={<LocalDining />}
            color="secondary"
            change="Your current cart"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Popular Items
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { name: 'Chicken Biryani', orders: 45, trend: '+15%' },
                { name: 'Paneer Butter Masala', orders: 32, trend: '+8%' },
                { name: 'Dal Tadka', orders: 28, trend: '+3%' },
                { name: 'Veg Fried Rice', orders: 24, trend: '-2%' },
              ].map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1">{item.name}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">{item.orders} orders</Typography>
                      <Chip 
                        label={item.trend} 
                        size="small" 
                        color={item.trend.startsWith('+') ? 'success' : 'error'}
                      />
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(item.orders / 50) * 100} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<Restaurant />}
                fullWidth
              >
                Browse Menu
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ShoppingCart />}
                fullWidth
              >
                View Cart ({cartItemsCount})
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Schedule />}
                fullWidth
              >
                Order History
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cafeteria Status
            </Typography>
            <Box sx={{ mt: 2 }}>
              {cafeterias.length > 0 ? (
                cafeterias.map((cafeteria) => (
                  <Box key={cafeteria.id} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">{cafeteria.floorName}</Typography>
                      <Chip 
                        label={cafeteria.isOpen ? 'Open' : 'Closed'} 
                        color={cafeteria.isOpen ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {cafeteria.currentCapacity}/{cafeteria.maxCapacity} people
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No cafeteria data available
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 