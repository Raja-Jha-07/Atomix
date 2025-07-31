import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  ShoppingCart,
  Analytics,
  Store,
  Person,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const drawerWidth = 240;

interface NavigationItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  requiredRoles?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/',
  },
  {
    text: 'Menu',
    icon: <Restaurant />,
    path: '/menu',
  },
  {
    text: 'Orders',
    icon: <ShoppingCart />,
    path: '/orders',
  },
  {
    text: 'Analytics',
    icon: <Analytics />,
    path: '/analytics',
    requiredRoles: ['ADMIN', 'CAFETERIA_MANAGER'],
  },
  {
    text: 'Vendor Portal',
    icon: <Store />,
    path: '/vendor',
    requiredRoles: ['VENDOR', 'CAFETERIA_MANAGER', 'ADMIN'],
  },
];

const userItems: NavigationItem[] = [
  {
    text: 'Profile',
    icon: <Person />,
    path: '/profile',
  },
  {
    text: 'Settings',
    icon: <Settings />,
    path: '/settings',
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const hasRequiredRole = (requiredRoles?: string[]) => {
    if (!requiredRoles || !user) return true;
    return requiredRoles.includes(user.role);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'static',
          height: '100%',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Navigation
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems
          .filter(item => hasRequiredRole(item.requiredRoles))
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      
      <Divider sx={{ mt: 'auto' }} />
      
      <List>
        {userItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 