import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Restaurant,
  People,
  AttachMoney,
  Schedule,
  LocalDining,
  AccountBalanceWallet,
  ShoppingCart,
  Favorite,
  CalendarToday,
  PieChart,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';

interface MetricData {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: React.ReactElement;
  color: string;
  description?: string;
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Admin/Manager business metrics
  const businessMetrics: MetricData[] = [
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

  // Employee personal analytics
  const personalMetrics: MetricData[] = [
    {
      title: 'Monthly Spending',
      value: '₹2,340',
      change: '+15%',
      trend: 'up',
      icon: <AccountBalanceWallet />,
      color: 'primary',
      description: 'Compared to last month',
    },
    {
      title: 'Orders This Month',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: <ShoppingCart />,
      color: 'success',
      description: '5 more than last month',
    },
    {
      title: 'Favorite Vendors',
      value: '3',
      change: '',
      trend: 'neutral',
      icon: <Favorite />,
      color: 'error',
      description: 'Most ordered from',
    },
    {
      title: 'Avg Order Value',
      value: '₹102',
      change: '+₹12',
      trend: 'up',
      icon: <LocalDining />,
      color: 'warning',
      description: 'Per order average',
    },
  ];

  // Mock personal spending data
  const personalSpendingBreakdown = [
    { category: 'North Indian', amount: 890, percentage: 38 },
    { category: 'South Indian', amount: 650, percentage: 28 },
    { category: 'Street Food', amount: 480, percentage: 20 },
    { category: 'Beverages', amount: 320, percentage: 14 },
  ];

  // Mock recent activity for employees
  const recentActivity = [
    { date: 'Today', item: 'Veg Thali', vendor: 'North Indian Corner', amount: 120 },
    { date: 'Yesterday', item: 'Masala Dosa', vendor: 'South Indian Express', amount: 80 },
    { date: '2 days ago', item: 'Paneer Roll', vendor: 'Street Food Hub', amount: 90 },
    { date: '3 days ago', item: 'Filter Coffee', vendor: 'Beverages Corner', amount: 25 },
    { date: '4 days ago', item: 'Biryani', vendor: 'North Indian Corner', amount: 150 },
  ];

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'CAFETERIA_MANAGER';
  const metricsToShow = isAdminOrManager ? businessMetrics : personalMetrics;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isAdminOrManager ? 'Business Analytics' : 'My Analytics'}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        {isAdminOrManager 
          ? 'Comprehensive overview of cafeteria operations and performance' 
          : 'Your personal spending insights and order history'
        }
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        {metricsToShow.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${metric.color}.main`,
                      color: 'white',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {metric.icon}
                  </Avatar>
                  {metric.trend !== 'neutral' && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {metric.trend === 'up' ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                    </Box>
                  )}
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {metric.value}
                </Typography>
                <Typography color="textSecondary" variant="overline" display="block">
                  {metric.title}
                </Typography>
                {metric.change && (
                  <Chip
                    label={metric.change}
                    color={metric.trend === 'up' ? 'success' : 'error'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
                {metric.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {metric.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Employee-specific: Spending Breakdown */}
        {!isAdminOrManager && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Spending Breakdown
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Your food preferences this month
                </Typography>
                {personalSpendingBreakdown.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{item.category}</Typography>
                      <Typography variant="body2">₹{item.amount}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {item.percentage}% of total spending
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Employee-specific: Recent Activity */}
        {!isAdminOrManager && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Your last 5 orders
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <LocalDining />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.item}
                          secondary={`${activity.vendor} • ${activity.date}`}
                        />
                        <Typography variant="subtitle2">
                          ₹{activity.amount}
                        </Typography>
                      </ListItem>
                      {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Employee-specific: Monthly Summary */}
        {!isAdminOrManager && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                        <CalendarToday />
                      </Avatar>
                      <Typography variant="h6">23</Typography>
                      <Typography variant="body2" color="textSecondary">Orders Placed</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                        <AttachMoney />
                      </Avatar>
                      <Typography variant="h6">₹2,340</Typography>
                      <Typography variant="body2" color="textSecondary">Total Spent</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                        <Favorite />
                      </Avatar>
                      <Typography variant="h6">3</Typography>
                      <Typography variant="body2" color="textSecondary">Favorite Vendors</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                        <Schedule />
                      </Avatar>
                      <Typography variant="h6">15 min</Typography>
                      <Typography variant="body2" color="textSecondary">Avg Wait Time</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Admin-specific: Detailed Business Analytics */}
        {isAdminOrManager && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Trends
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Last 7 days performance
                  </Typography>
                  {/* Placeholder for chart */}
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
                    <Typography variant="body2" color="textSecondary">
                      Revenue Chart Placeholder
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Popular Items
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Top selling items today
                  </Typography>
                  <List>
                    {[
                      { item: 'Veg Thali', orders: 45, revenue: '₹5,400' },
                      { item: 'Biryani', orders: 38, revenue: '₹5,700' },
                      { item: 'Masala Dosa', orders: 32, revenue: '₹2,560' },
                      { item: 'Paneer Roll', orders: 28, revenue: '₹2,520' },
                    ].map((item, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={item.item}
                          secondary={`${item.orders} orders`}
                        />
                        <Typography variant="subtitle2">
                          {item.revenue}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default AnalyticsPage; 