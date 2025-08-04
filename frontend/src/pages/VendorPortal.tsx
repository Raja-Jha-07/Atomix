import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Restaurant,
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  People,
  Add,
  Edit,
  Delete,
  Visibility,
  Schedule,
  Star,
  CheckCircle,
  Pending,
  Cancel,
  Notifications,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vendor-tabpanel-${index}`}
      aria-labelledby={`vendor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const VendorPortal: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [addMenuItemOpen, setAddMenuItemOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock vendor stats
  const vendorStats = [
    {
      title: 'Today\'s Revenue',
      value: '₹3,240',
      change: '+12%',
      icon: <AttachMoney />,
      color: 'success',
    },
    {
      title: 'Active Orders',
      value: '8',
      change: '+3',
      icon: <ShoppingCart />,
      color: 'primary',
    },
    {
      title: 'Menu Items',
      value: '24',
      change: '+2',
      icon: <Restaurant />,
      color: 'info',
    },
    {
      title: 'Customer Rating',
      value: '4.8',
      change: '+0.2',
      icon: <Star />,
      color: 'warning',
    },
  ];

  // Mock menu items
  const menuItems = [
    { id: 1, name: 'Veg Thali', price: 120, category: 'Main Course', status: 'Active', orders: 23 },
    { id: 2, name: 'Paneer Butter Masala', price: 150, category: 'Main Course', status: 'Active', orders: 18 },
    { id: 3, name: 'Masala Dosa', price: 80, category: 'South Indian', status: 'Active', orders: 31 },
    { id: 4, name: 'Filter Coffee', price: 25, category: 'Beverages', status: 'Inactive', orders: 0 },
  ];

  // Mock active orders
  const activeOrders = [
    { id: '#ORD001', customer: 'John Doe', items: 'Veg Thali x2', amount: 240, status: 'Preparing', time: '10 min ago' },
    { id: '#ORD002', customer: 'Jane Smith', items: 'Masala Dosa x1', amount: 80, status: 'Ready', time: '5 min ago' },
    { id: '#ORD003', customer: 'Mike Wilson', items: 'Paneer Butter Masala x1', amount: 150, status: 'Delivered', time: '2 min ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparing': return 'warning';
      case 'Ready': return 'info';
      case 'Delivered': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Portal
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Manage your menu, track orders, and grow your business
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {vendorStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="overline" display="block">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.change}
                      color={stat.color as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}.main`, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="vendor portal tabs">
          <Tab label="Dashboard" />
          <Tab label="Menu Management" />
          <Tab label="Orders" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <CheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Order #ORD003 completed"
                      secondary="₹150 earned • 2 minutes ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <Schedule />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="New order received"
                      secondary="Veg Thali x2 • 10 minutes ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <Star />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="New 5-star review"
                      secondary="From John Doe • 1 hour ago"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Add />}
                      onClick={() => setAddMenuItemOpen(true)}
                    >
                      Add New Menu Item
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" fullWidth startIcon={<Schedule />}>
                      Update Operating Hours
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" fullWidth startIcon={<Notifications />}>
                      Send Announcement
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Menu Management Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Menu Items</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddMenuItemOpen(true)}
          >
            Add Item
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Orders Today</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={item.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.orders}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    <IconButton size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Orders Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Active Orders
        </Typography>
        <Grid container spacing={2}>
          {activeOrders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{order.id}</Typography>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    {order.customer}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {order.items}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    ₹{order.amount}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {order.time}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {order.status === 'Preparing' && (
                      <Button variant="contained" size="small" fullWidth>
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'Ready' && (
                      <Button variant="contained" color="success" size="small" fullWidth>
                        Mark Delivered
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Trend
                </Typography>
                <Typography variant="h4" color="primary">
                  ₹18,450
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  This Week
                </Typography>
                <LinearProgress variant="determinate" value={75} sx={{ mt: 2 }} />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  75% of monthly target achieved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Popular Items
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Masala Dosa" secondary="31 orders today" />
                    <Typography variant="body2">₹2,480</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Veg Thali" secondary="23 orders today" />
                    <Typography variant="body2">₹2,760</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Paneer Butter Masala" secondary="18 orders today" />
                    <Typography variant="body2">₹2,700</Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Add Menu Item Dialog */}
      <Dialog open={addMenuItemOpen} onClose={() => setAddMenuItemOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Item Name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Price" type="number" InputProps={{ startAdornment: '₹' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select>
                  <MenuItem value="main">Main Course</MenuItem>
                  <MenuItem value="south">South Indian</MenuItem>
                  <MenuItem value="beverages">Beverages</MenuItem>
                  <MenuItem value="desserts">Desserts</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMenuItemOpen(false)}>Cancel</Button>
          <Button variant="contained">Add Item</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorPortal; 