import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart,
  Notifications,
  AccountCircle,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const Navbar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { currentOrder } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const cartItemCount = currentOrder.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Atomix Cafeteria
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Cart Icon */}
          <IconButton color="inherit">
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 