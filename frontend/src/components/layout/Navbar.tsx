import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Notifications,
  AccountCircle,
  Logout,
  Settings,
  Person,
  Brightness4,
  Brightness7,
  AccountBalanceWallet,
  MoreVert,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useLogoutMutation } from '../../store/api/authApi';
import { logout } from '../../store/slices/authSlice';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const theme = useTheme();
  
  const [logoutMutation] = useLogoutMutation();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if the server logout fails, we should still clear local state
      console.error('Server logout failed:', error);
    } finally {
      dispatch(logout());
      navigate('/login');
      handleMenuClose();
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
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

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'CAFETERIA_MANAGER':
        return 'Manager';
      case 'VENDOR':
        return 'Vendor';
      case 'EMPLOYEE':
        return 'Employee';
      default:
        return role;
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important', px: 3 }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.2)} 0%, ${alpha(theme.palette.common.white, 0.1)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                A
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: '0.5px' }}>
                Atomix Cafeteria
              </Typography>
              <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                Digital Food Experience
              </Typography>
            </Box>
          </Box>

          {/* User Info & Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* User Role Chip */}
            <Chip
              label={getRoleDisplayName(user?.role || '')}
              color={getRoleColor(user?.role || '') as any}
              size="small"
              sx={{
                fontWeight: 600,
                color: 'white',
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />

            {/* Food Card Balance for Employees */}
            {user?.role === 'EMPLOYEE' && (
              <Tooltip title="Food Card Balance">
                <Chip
                  icon={<AccountBalanceWallet sx={{ color: 'white !important' }} />}
                  label={`₹${user?.foodCardBalance || 0}`}
                  sx={{
                    background: alpha(theme.palette.common.white, 0.2),
                    color: 'white',
                    fontWeight: 600,
                    '& .MuiChip-label': {
                      px: 1.5,
                    },
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                  }}
                />
              </Tooltip>
            )}

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationMenuOpen}
                sx={{
                  color: 'white',
                  background: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    background: alpha(theme.palette.common.white, 0.2),
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Tooltip title="Account menu">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  ml: 1,
                  background: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    background: alpha(theme.palette.common.white, 0.2),
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {getInitials(user?.firstName, user?.lastName)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
            mt: 1.5,
            minWidth: 320,
            borderRadius: 2,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem>
          <ListItemText
            primary="New order received"
            secondary="2 minutes ago"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem>
          <ListItemText
            primary="Payment completed"
            secondary="5 minutes ago"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem>
          <ListItemText
            primary="Food card recharged"
            secondary="10 minutes ago"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>

      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        {user?.role === 'ADMIN' && (
          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem 
          onClick={handleLogout}
          sx={{
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar; 