import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Restaurant,
  People,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';

const AnalyticsPage: React.FC = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '₹2,45,670',
      change: '+12.5%',
      trend: 'up',
      icon: <AttachMoney />,
      color: 'success',
    },
    {
      title: 'Orders Today',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: <Restaurant />,
      color: 'primary',
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '-2.1%',
      trend: 'down',
      icon: <People />,
      color: 'warning',
    },
    {
      title: 'Avg Order Time',
      value: '18 min',
      change: '-5.3%',
      trend: 'up',
      icon: <Schedule />,
      color: 'info',
    },
  ];

  const popularItems = [
    { name: 'Chicken Biryani', orders: 85, percentage: 90 },
    { name: 'Paneer Butter Masala', orders: 67, percentage: 70 },
    { name: 'Dal Tadka', orders: 52, percentage: 55 },
    { name: 'Veg Fried Rice', orders: 41, percentage: 43 },
    { name: 'Masala Chai', orders: 38, percentage: 40 },
  ];

  const hourlyData = [
    { time: '9 AM', orders: 12 },
    { time: '10 AM', orders: 25 },
    { time: '11 AM', orders: 18 },
    { time: '12 PM', orders: 45 },
    { time: '1 PM', orders: 62 },
    { time: '2 PM', orders: 38 },
    { time: '3 PM', orders: 22 },
    { time: '4 PM', orders: 15 },
    { time: '5 PM', orders: 28 },
    { time: '6 PM', orders: 35 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Insights and performance metrics for your cafeteria
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {metric.title}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      {metric.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {metric.trend === 'up' ? (
                        <TrendingUp color="success" sx={{ fontSize: 16 }} />
                      ) : (
                        <TrendingDown color="error" sx={{ fontSize: 16 }} />
                      )}
                      <Chip
                        label={metric.change}
                        color={metric.trend === 'up' ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${metric.color}.light`,
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(metric.icon, { sx: { color: `${metric.color}.main` } })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Popular Items */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Popular Items
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Based on orders in the last 30 days
              </Typography>

              <Box sx={{ mt: 2 }}>
                {popularItems.map((item, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">{item.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.orders} orders
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.percentage} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Hourly Orders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Orders by Hour (Today)
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Peak hours and order distribution
              </Typography>

              <Box sx={{ mt: 2 }}>
                {hourlyData.map((hour, index) => {
                  const maxOrders = Math.max(...hourlyData.map(h => h.orders));
                  const percentage = (hour.orders / maxOrders) * 100;
                  
                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">{hour.time}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {hour.orders} orders
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage} 
                        color="primary"
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      89%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Customer Satisfaction
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      ₹18,450
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Today's Revenue
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      45
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active Menu Items
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      15 min
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avg Prep Time
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage; 