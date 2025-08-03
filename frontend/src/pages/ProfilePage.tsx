import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Email,
  Badge,
  Business,
  Phone,
  LocationOn,
  AccountBalance,
  Edit,
  Save,
  Cancel,
  AccountBalanceWallet,
  CalendarToday,
  Person,
  Work,
  Schedule,
  TrendingUp,
  Favorite,
  ShoppingCart,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import RechargeDialog from '../components/payment/RechargeDialog';

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    phoneNumber: user?.phoneNumber || '',
    department: user?.department || '',
    floorId: user?.floorId || '',
  });

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'CAFETERIA_MANAGER':
        return 'warning';
      case 'VENDOR':
        return 'info';
      case 'EMPLOYEE':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleEditSave = () => {
    // TODO: API call to update user profile
    setEditMode(false);
  };

  const handleEditCancel = () => {
    setEditData({
      phoneNumber: user?.phoneNumber || '',
      department: user?.department || '',
      floorId: user?.floorId || '',
    });
    setEditMode(false);
  };

  const handleRechargeSuccess = (amount: number) => {
    setSuccessMessage(`Successfully recharged ₹${amount.toFixed(2)} to your food card!`);
    // TODO: Update user balance in state/context
  };

  // Mock data for user stats
  const userStats = [
    { label: 'Orders This Month', value: '23', icon: <ShoppingCart />, color: 'primary' },
    { label: 'Total Spent', value: '₹2,340', icon: <AccountBalanceWallet />, color: 'success' },
    { label: 'Favorite Items', value: '5', icon: <Favorite />, color: 'error' },
    { label: 'Member Since', value: 'Jan 2024', icon: <CalendarToday />, color: 'info' },
  ];

  const recentOrders = [
    { item: 'Veg Thali', vendor: 'North Indian Corner', date: 'Today', amount: '₹120' },
    { item: 'Masala Dosa', vendor: 'South Indian Express', date: 'Yesterday', amount: '₹80' },
    { item: 'Paneer Roll', vendor: 'Street Food Hub', date: '2 days ago', amount: '₹90' },
  ];

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">User information not available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Manage your account information and preferences
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getUserInitials()
                )}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
              
              <Chip
                label={formatRole(user.role)}
                color={getRoleColor(user.role) as any}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {user.email}
              </Typography>

              {user.employeeId && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Employee ID: {user.employeeId}
                </Typography>
              )}

              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
                sx={{ mt: 2 }}
                disabled={editMode}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Food Card Balance */}
          {user.foodCardBalance !== undefined && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Food Card</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary.dark">
                    ₹{user.foodCardBalance.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="primary.dark">
                    Available Balance
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => setRechargeDialogOpen(true)}
                >
                  Recharge Card
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                {editMode && (
                  <Box>
                    <IconButton onClick={handleEditSave} color="primary">
                      <Save />
                    </IconButton>
                    <IconButton onClick={handleEditCancel}>
                      <Cancel />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={user.email}
                      />
                    </ListItem>
                    
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone Number"
                        secondary={
                          editMode ? (
                            <TextField
                              size="small"
                              value={editData.phoneNumber}
                              onChange={(e) => setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                              placeholder="Enter phone number"
                              sx={{ mt: 1 }}
                            />
                          ) : (
                            user.phoneNumber || 'Not provided'
                          )
                        }
                      />
                    </ListItem>

                    {user.employeeId && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Badge color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Employee ID"
                          secondary={user.employeeId}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Business color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Department"
                        secondary={
                          editMode ? (
                            <TextField
                              size="small"
                              value={editData.department}
                              onChange={(e) => setEditData(prev => ({ ...prev, department: e.target.value }))}
                              placeholder="Enter department"
                              sx={{ mt: 1 }}
                            />
                          ) : (
                            user.department || 'Not specified'
                          )
                        }
                      />
                    </ListItem>

                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <LocationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Floor"
                        secondary={
                          editMode ? (
                            <TextField
                              size="small"
                              value={editData.floorId}
                              onChange={(e) => setEditData(prev => ({ ...prev, floorId: e.target.value }))}
                              placeholder="Enter floor"
                              sx={{ mt: 1 }}
                            />
                          ) : (
                            user.floorId || 'Not specified'
                          )
                        }
                      />
                    </ListItem>

                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Work color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Role"
                        secondary={formatRole(user.role)}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* User Stats */}
          {user.role === 'EMPLOYEE' && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Statistics
                </Typography>
                <Grid container spacing={2}>
                  {userStats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: `${stat.color}.light` }}>
                        <Box sx={{ color: `${stat.color}.main`, mb: 1 }}>
                          {stat.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: `${stat.color}.dark` }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: `${stat.color}.dark` }}>
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Recent Orders */}
          {user.role === 'EMPLOYEE' && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                <List>
                  {recentOrders.map((order, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'secondary.light' }}>
                          🍽️
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={order.item}
                        secondary={`${order.vendor} • ${order.date}`}
                      />
                      <Typography variant="subtitle2" color="primary">
                        {order.amount}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
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

export default ProfilePage; 