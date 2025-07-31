import React from 'react';
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
} from '@mui/material';
import {
  Email,
  Badge,
  Business,
  Phone,
  LocationOn,
  AccountBalance,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

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

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">User information not available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* User Information Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 3,
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Chip
                    label={formatRole(user.role)}
                    color={getRoleColor(user.role) as any}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                </ListItem>

                {user.employeeId && (
                  <ListItem>
                    <ListItemIcon>
                      <Badge />
                    </ListItemIcon>
                    <ListItemText
                      primary="Employee ID"
                      secondary={user.employeeId}
                    />
                  </ListItem>
                )}

                {user.phoneNumber && (
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone Number"
                      secondary={user.phoneNumber}
                    />
                  </ListItem>
                )}

                {user.department && (
                  <ListItem>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText
                      primary="Department"
                      secondary={user.department}
                    />
                  </ListItem>
                )}

                {user.floorId && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Floor"
                      secondary={user.floorId}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Information Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>

              <Box sx={{ textAlign: 'center', py: 2 }}>
                <AccountBalance sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" color="primary">
                  ₹{user.foodCardBalance?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Food Card Balance
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Account Status:</Typography>
                <Chip
                  label={user.isActive ? 'Active' : 'Inactive'}
                  color={user.isActive ? 'success' : 'error'}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Email Verified:</Typography>
                <Chip
                  label={user.emailVerified ? 'Verified' : 'Not Verified'}
                  color={user.emailVerified ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage; 