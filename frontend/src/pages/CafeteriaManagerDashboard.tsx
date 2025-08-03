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
  Switch,
  FormControlLabel,
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
  Business,
  Assessment,
  SupervisorAccount,
  Store,
  BarChart,
  TrendingDown,
  Warning,
  Settings,
  LocalDining,
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
      id={`manager-tabpanel-${index}`}
      aria-labelledby={`manager-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CafeteriaManagerDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [vendorApprovalOpen, setVendorApprovalOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock manager stats
  const managerStats = [
    {
      title: 'Total Revenue',
      value: '₹45,240',
      change: '+18%',
      icon: <AttachMoney />,
      color: 'success',
      description: 'Today\'s cafeteria revenue',
    },
    {
      title: 'Active Vendors',
      value: '12',
      change: '+2',
      icon: <Store />,
      color: 'primary',
      description: 'Operational food vendors',
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+12%',
      icon: <ShoppingCart />,
      color: 'info',
      description: 'Orders processed today',
    },
    {
      title: 'Staff On Duty',
      value: '8/10',
      change: '-2',
      icon: <SupervisorAccount />,
      color: 'warning',
      description: 'Active cafeteria staff',
    },
  ];

  // Mock pending vendor applications
  const pendingVendors = [
    { id: 1, name: 'Healthy Bites', type: 'Salads & Wraps', date: '2 days ago', rating: 4.5 },
    { id: 2, name: 'Coffee Corner', type: 'Beverages', date: '1 day ago', rating: 4.8 },
    { id: 3, name: 'Desert Paradise', type: 'Desserts', date: '5 hours ago', rating: 4.3 },
  ];

  // Mock staff performance
  const staffPerformance = [
    { name: 'John Smith', role: 'Cashier', shift: 'Morning', orders: 45, rating: 4.8, status: 'active' },
    { name: 'Sarah Johnson', role: 'Food Coordinator', shift: 'Afternoon', orders: 38, rating: 4.6, status: 'active' },
    { name: 'Mike Wilson', role: 'Cleaner', shift: 'Evening', orders: 0, rating: 4.9, status: 'active' },
    { name: 'Emma Davis', role: 'Cashier', shift: 'Morning', orders: 42, rating: 4.7, status: 'break' },
  ];

  // Mock vendor performance
  const vendorPerformance = [
    { name: 'North Indian Corner', orders: 45, revenue: '₹5,400', rating: 4.8, status: 'active' },
    { name: 'South Indian Express', orders: 38, revenue: '₹4,560', rating: 4.6, status: 'active' },
    { name: 'Street Food Hub', orders: 32, revenue: '₹3,840', rating: 4.4, status: 'active' },
    { name: 'Beverages Station', orders: 28, revenue: '₹2,240', rating: 4.5, status: 'maintenance' },
  ];

  // Mock alerts
  const alerts = [
    { type: 'warning', message: 'Low stock alert: Paper cups running low', time: '10 min ago' },
    { type: 'info', message: 'New vendor application received', time: '1 hour ago' },
    { type: 'error', message: 'POS system error reported at counter 3', time: '2 hours ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'break': return 'warning';
      case 'maintenance': return 'error';
      default: return 'default';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cafeteria Manager Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Oversee operations, manage vendors, and monitor performance
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {managerStats.map((stat, index) => (
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
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="manager dashboard tabs">
          <Tab label="Overview" />
          <Tab label="Vendor Management" />
          <Tab label="Staff Oversight" />
          <Tab label="Analytics" />
          <Tab label="Operations" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Alerts */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Alerts
                </Typography>
                <List>
                  {alerts.map((alert, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${getAlertColor(alert.type)}.main` }}>
                          <Warning />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={alert.message}
                        secondary={alert.time}
                      />
                    </ListItem>
                  ))}
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
                      onClick={() => setVendorApprovalOpen(true)}
                    >
                      Review Vendor Applications
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" fullWidth startIcon={<Assessment />}>
                      Generate Daily Report
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" fullWidth startIcon={<Notifications />}>
                      Send Staff Announcement
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" fullWidth startIcon={<Settings />}>
                      System Settings
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Vendor Management Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Pending Applications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Vendor Applications
                </Typography>
                <List>
                  {pendingVendors.map((vendor) => (
                    <ListItem key={vendor.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <Pending />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={vendor.name}
                        secondary={`${vendor.type} • ${vendor.date} • ${vendor.rating}★`}
                      />
                      <Box>
                        <IconButton color="success" size="small">
                          <CheckCircle />
                        </IconButton>
                        <IconButton color="error" size="small">
                          <Cancel />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Vendor Performance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vendor Performance Today
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Vendor</TableCell>
                        <TableCell>Orders</TableCell>
                        <TableCell>Revenue</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vendorPerformance.map((vendor, index) => (
                        <TableRow key={index}>
                          <TableCell>{vendor.name}</TableCell>
                          <TableCell>{vendor.orders}</TableCell>
                          <TableCell>{vendor.revenue}</TableCell>
                          <TableCell>
                            <Chip
                              label={vendor.status}
                              color={getStatusColor(vendor.status) as any}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Staff Oversight Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Staff Performance & Schedule
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Shift</TableCell>
                    <TableCell>Orders Handled</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staffPerformance.map((staff, index) => (
                    <TableRow key={index}>
                      <TableCell>{staff.name}</TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>{staff.shift}</TableCell>
                      <TableCell>{staff.orders}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star color="warning" sx={{ mr: 0.5, fontSize: 16 }} />
                          {staff.rating}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={staff.status}
                          color={getStatusColor(staff.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Trend
                </Typography>
                <Typography variant="h4" color="primary">
                  ₹2,84,350
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  This Week
                </Typography>
                <LinearProgress variant="determinate" value={85} sx={{ mt: 2 }} />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  85% of weekly target achieved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performing Vendors
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="North Indian Corner" secondary="45 orders • 4.8★" />
                    <Typography variant="body2">₹5,400</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="South Indian Express" secondary="38 orders • 4.6★" />
                    <Typography variant="body2">₹4,560</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Street Food Hub" secondary="32 orders • 4.4★" />
                    <Typography variant="body2">₹3,840</Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Operations Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Controls
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Emergency Stop" secondary="Stop all vendor operations" />
                    <Switch color="error" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Maintenance Mode" secondary="Enable for system updates" />
                    <Switch />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Order Acceptance" secondary="Allow new orders" />
                    <Switch defaultChecked />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Payment Processing" secondary="Enable card payments" />
                    <Switch defaultChecked />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Operational Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Daily Order Limit"
                      type="number"
                      defaultValue="500"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Peak Hours Start"
                      type="time"
                      defaultValue="12:00"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Peak Hours End"
                      type="time"
                      defaultValue="14:00"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" fullWidth>
                      Save Settings
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Vendor Approval Dialog */}
      <Dialog open={vendorApprovalOpen} onClose={() => setVendorApprovalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Vendor Application Review</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Healthy Bites - Salads & Wraps
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Business License" value="BL123456789" InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Rating" value="4.5 stars" InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value="Fresh and healthy salads, wraps, and sandwiches made with organic ingredients."
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Approval Decision
              </Typography>
              <FormControl fullWidth>
                <Select defaultValue="pending">
                  <MenuItem value="pending">Pending Review</MenuItem>
                  <MenuItem value="approved">Approve</MenuItem>
                  <MenuItem value="rejected">Reject</MenuItem>
                  <MenuItem value="more-info">Request More Information</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVendorApprovalOpen(false)}>Cancel</Button>
          <Button variant="contained">Submit Decision</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CafeteriaManagerDashboard; 