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
  Rating,
  Tooltip,
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  AttachMoney,
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
  Store,
  Block,
  PersonAdd,
  Business,
  Phone,
  Email,
  LocationOn,
  MoreVert,
  Search,
  FilterList,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';

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

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  cuisineType: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
  rating: number;
  totalOrders: number;
  revenue: number;
  joinedDate: string;
  lastActive: string;
  description: string;
  operatingHours: string;
  menuItemsCount: number;
}

const VendorPortal: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [addMenuItemOpen, setAddMenuItemOpen] = useState(false);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [editVendorOpen, setEditVendorOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const isVendor = user?.role === 'VENDOR';
  const isManager = user?.role === 'CAFETERIA_MANAGER' || user?.role === 'ADMIN';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock vendors data for management view
  const vendors: Vendor[] = [
    {
      id: 1,
      name: "North Indian Corner",
      email: "north.indian@example.com",
      phone: "+91 98765 43210",
      address: "Building A, Floor 2",
      cuisineType: "North Indian",
      status: "ACTIVE",
      rating: 4.5,
      totalOrders: 245,
      revenue: 58420,
      joinedDate: "2024-01-15",
      lastActive: "2 minutes ago",
      description: "Authentic North Indian cuisine with traditional recipes",
      operatingHours: "9:00 AM - 6:00 PM",
      menuItemsCount: 24
    },
    {
      id: 2,
      name: "South Indian Express",
      email: "south.express@example.com",
      phone: "+91 98765 43211",
      address: "Building B, Floor 1",
      cuisineType: "South Indian",
      status: "ACTIVE",
      rating: 4.7,
      totalOrders: 312,
      revenue: 67890,
      joinedDate: "2024-02-01",
      lastActive: "5 minutes ago",
      description: "Fresh dosas, idlis, and traditional South Indian meals",
      operatingHours: "8:00 AM - 7:00 PM",
      menuItemsCount: 18
    },
    {
      id: 3,
      name: "Healthy Bites",
      email: "healthy.bites@example.com",
      phone: "+91 98765 43212",
      address: "Building C, Floor 3",
      cuisineType: "Healthy",
      status: "PENDING",
      rating: 0,
      totalOrders: 0,
      revenue: 0,
      joinedDate: "2024-12-01",
      lastActive: "Never",
      description: "Nutritious and healthy meal options for fitness enthusiasts",
      operatingHours: "10:00 AM - 5:00 PM",
      menuItemsCount: 0
    },
    {
      id: 4,
      name: "Street Food Junction",
      email: "street.food@example.com",
      phone: "+91 98765 43213",
      address: "Building A, Floor 1",
      cuisineType: "Street Food",
      status: "SUSPENDED",
      rating: 3.8,
      totalOrders: 89,
      revenue: 12340,
      joinedDate: "2024-03-15",
      lastActive: "2 days ago",
      description: "Popular street food items with authentic flavors",
      operatingHours: "11:00 AM - 4:00 PM",
      menuItemsCount: 15
    }
  ];

  const vendorStats = [
    {
      title: isVendor ? 'Today\'s Revenue' : 'Total Vendors',
      value: isVendor ? '₹3,240' : '24',
      change: isVendor ? '+12%' : '+3 this month',
      icon: isVendor ? <AttachMoney /> : <Store />,
      color: 'success',
    },
    {
      title: isVendor ? 'Active Orders' : 'Active Vendors',
      value: isVendor ? '8' : '18',
      change: isVendor ? '+3' : '+2 this week',
      icon: isVendor ? <ShoppingCart /> : <CheckCircle />,
      color: 'primary',
    },
    {
      title: isVendor ? 'Menu Items' : 'Pending Approvals',
      value: isVendor ? '24' : '3',
      change: isVendor ? '+2' : 'Requires attention',
      icon: isVendor ? <Restaurant /> : <Pending />,
      color: isVendor ? 'info' : 'warning',
    },
    {
      title: isVendor ? 'Customer Rating' : 'Avg. Rating',
      value: isVendor ? '4.8' : '4.2',
      change: isVendor ? '+0.2' : '+0.1 this month',
      icon: <Star />,
      color: 'warning',
    },
  ];

  const menuItems = [
    { id: 1, name: 'Veg Thali', price: 120, category: 'Main Course', status: 'Active', orders: 23 },
    { id: 2, name: 'Paneer Butter Masala', price: 150, category: 'Main Course', status: 'Active', orders: 18 },
    { id: 3, name: 'Masala Dosa', price: 80, category: 'South Indian', status: 'Active', orders: 31 },
    { id: 4, name: 'Filter Coffee', price: 25, category: 'Beverages', status: 'Inactive', orders: 0 },
  ];

  const activeOrders = [
    { id: '#ORD001', customer: 'John Doe', items: 'Veg Thali x2', amount: 240, status: 'Preparing', time: '10 min ago' },
    { id: '#ORD002', customer: 'Jane Smith', items: 'Masala Dosa x1', amount: 80, status: 'Ready', time: '5 min ago' },
    { id: '#ORD003', customer: 'Mike Wilson', items: 'Paneer Butter Masala x1', amount: 150, status: 'Delivered', time: '2 min ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'SUSPENDED': return 'error';
      case 'INACTIVE': return 'default';
      case 'Preparing': return 'warning';
      case 'Ready': return 'info';
      case 'Delivered': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle />;
      case 'PENDING': return <Pending />;
      case 'SUSPENDED': return <Block />;
      case 'INACTIVE': return <Cancel />;
      default: return <Cancel />;
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditVendorOpen(true);
  };



  // Vendor Management Interface (for Admins/Managers)
  const renderVendorManagement = () => (
    <>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Vendor Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage vendor registrations, approvals, and performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setAddVendorOpen(true)}
        >
          Add Vendor
        </Button>
      </Box>

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

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search vendors by name, email, or cuisine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                {filteredVendors.length} vendor(s) found
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vendors List */}
      <Grid container spacing={3}>
        {filteredVendors.map((vendor) => (
          <Grid item xs={12} lg={6} key={vendor.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <Restaurant />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {vendor.name}
                      </Typography>
                      <Chip 
                        icon={getStatusIcon(vendor.status)}
                        label={vendor.status}
                        color={getStatusColor(vendor.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Email sx={{ mr: 1, fontSize: 16 }} />
                    {vendor.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Phone sx={{ mr: 1, fontSize: 16 }} />
                    {vendor.phone}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                    {vendor.address}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Business sx={{ mr: 1, fontSize: 16 }} />
                    {vendor.cuisineType}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Rating</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={vendor.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {vendor.rating || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">Orders</Typography>
                    <Typography variant="h6">{vendor.totalOrders}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">Revenue</Typography>
                    <Typography variant="h6" color="primary">₹{vendor.revenue.toLocaleString()}</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                  "{vendor.description}"
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Joined: {new Date(vendor.joinedDate).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Vendor">
                      <IconButton size="small" color="primary" onClick={() => handleEditVendor(vendor)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Vendor">
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Vendor Dialog */}
      <Dialog open={addVendorOpen} onClose={() => setAddVendorOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Vendor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Vendor Name" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cuisine Type</InputLabel>
                <Select>
                  <MenuItem value="North Indian">North Indian</MenuItem>
                  <MenuItem value="South Indian">South Indian</MenuItem>
                  <MenuItem value="Chinese">Chinese</MenuItem>
                  <MenuItem value="Continental">Continental</MenuItem>
                  <MenuItem value="Street Food">Street Food</MenuItem>
                  <MenuItem value="Healthy">Healthy</MenuItem>
                  <MenuItem value="Desserts">Desserts</MenuItem>
                  <MenuItem value="Beverages">Beverages</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Operating Hours" placeholder="9:00 AM - 6:00 PM" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Initial Status</InputLabel>
                <Select defaultValue="PENDING">
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVendorOpen(false)}>Cancel</Button>
          <Button variant="contained">Add Vendor</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={editVendorOpen} onClose={() => setEditVendorOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Vendor - {selectedVendor?.name}</DialogTitle>
        <DialogContent>
          {selectedVendor && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Vendor Name" defaultValue={selectedVendor.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" defaultValue={selectedVendor.email} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" defaultValue={selectedVendor.phone} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select defaultValue={selectedVendor.status}>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" defaultValue={selectedVendor.address} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Operating Hours" defaultValue={selectedVendor.operatingHours} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Cuisine Type</InputLabel>
                  <Select defaultValue={selectedVendor.cuisineType}>
                    <MenuItem value="North Indian">North Indian</MenuItem>
                    <MenuItem value="South Indian">South Indian</MenuItem>
                    <MenuItem value="Chinese">Chinese</MenuItem>
                    <MenuItem value="Continental">Continental</MenuItem>
                    <MenuItem value="Street Food">Street Food</MenuItem>
                    <MenuItem value="Healthy">Healthy</MenuItem>
                    <MenuItem value="Desserts">Desserts</MenuItem>
                    <MenuItem value="Beverages">Beverages</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" multiline rows={3} defaultValue={selectedVendor.description} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditVendorOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Individual Vendor Dashboard
  const renderVendorDashboard = () => (
    <>
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
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      {isManager ? renderVendorManagement() : renderVendorDashboard()}
    </Box>
  );
};

export default VendorPortal; 