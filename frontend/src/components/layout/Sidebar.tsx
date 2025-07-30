import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  ShoppingCart,
  Analytics,
  Store,
  Settings,
  LiveTv,
  MusicNote,
  Inventory,
  Feedback,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const drawerWidth = 240;

interface MenuItemProps {
  text: string;
  icon: React.ReactElement;
  path: string;
  roles?: string[];
}

const menuItems: MenuItemProps[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Menu', icon: <Restaurant />, path: '/menu' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
  { text: 'Live Status', icon: <LiveTv />, path: '/live-status' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics', roles: ['ADMIN', 'CAFETERIA_MANAGER'] },
  { text: 'Vendor Portal', icon: <Store />, path: '/vendor', roles: ['VENDOR', 'ADMIN'] },
  { text: 'Music Control', icon: <MusicNote />, path: '/music', roles: ['ADMIN', 'CAFETERIA_MANAGER'] },
  { text: 'Inventory', icon: <Inventory />, path: '/inventory', roles: ['VENDOR', 'ADMIN'] },
  { text: 'Feedback', icon: <Feedback />, path: '/feedback' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

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
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {filteredMenuItems.slice(0, 4).map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          {filteredMenuItems.slice(4).map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 