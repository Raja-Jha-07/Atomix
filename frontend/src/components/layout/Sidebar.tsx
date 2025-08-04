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
  alpha,
  useTheme,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  ShoppingCart,
  Analytics,
  Store,
  Person,
  Settings,
  SupervisorAccount,
  BusinessCenter,
  Payment,
  AccountBalanceWallet,
  TrendingUp,
  People,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const drawerWidth = 280;

interface NavigationItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  requiredRoles?: string[];
  badge?: string | number;
  isNew?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
    requiredRoles: ['ADMIN', 'EMPLOYEE'],
  },
  {
    text: 'Manager Dashboard',
    icon: <SupervisorAccount />,
    path: '/manager-dashboard',
    requiredRoles: ['CAFETERIA_MANAGER'],
  },
  {
    text: 'Vendor',
    icon: <BusinessCenter />,
    path: '/vendor-portal',
    requiredRoles: ['ADMIN'],
    badge: 3, // Pending vendor approvals for admins
  },
  {
    text: 'My Business',
    icon: <Store />,
    path: '/vendor-portal',
    requiredRoles: ['VENDOR'],
  },
  {
    text: 'Menu',
    icon: <Restaurant />,
    path: '/menu',
    requiredRoles: ['ADMIN', 'EMPLOYEE', 'CAFETERIA_MANAGER'],
    badge: 'Hot',
    isNew: false,
  },
  {
    text: 'Orders',
    icon: <ShoppingCart />,
    path: '/orders',
    requiredRoles: ['ADMIN', 'EMPLOYEE', 'VENDOR', 'CAFETERIA_MANAGER'],
    badge: 3,
  },
  {
    text: 'Analytics',
    icon: <Analytics />,
    path: '/analytics',
    requiredRoles: ['ADMIN', 'CAFETERIA_MANAGER'],
  },
  {
    text: 'Payments',
    icon: <Payment />,
    path: '/payments',
    requiredRoles: ['ADMIN', 'EMPLOYEE', 'CAFETERIA_MANAGER'],
  },
  {
    text: 'Profile',
    icon: <Person />,
    path: '/profile',
    requiredRoles: ['ADMIN', 'EMPLOYEE', 'VENDOR', 'CAFETERIA_MANAGER'],
  },
  {
    text: 'Settings',
    icon: <Settings />,
    path: '/settings',
    requiredRoles: ['ADMIN'],
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const theme = useTheme();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return theme.palette.error.main;
      case 'CAFETERIA_MANAGER':
        return theme.palette.warning.main;
      case 'VENDOR':
        return theme.palette.info.main;
      case 'EMPLOYEE':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
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

  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.requiredRoles || !user?.role) return false;
    return item.requiredRoles.includes(user.role);
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          boxShadow: theme.palette.mode === 'dark' 
            ? '4px 0 20px rgba(0, 0, 0, 0.3)' 
            : '4px 0 20px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Box 
        sx={{ 
          p: 3, 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              fontWeight: 700,
              fontSize: '1.2rem',
              mr: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {getInitials(user?.firstName, user?.lastName)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                fontSize: '1rem',
                color: theme.palette.text.primary,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Chip
              label={getRoleDisplayName(user?.role || '')}
              size="small"
              sx={{
                backgroundColor: alpha(getRoleColor(user?.role || ''), 0.1),
                color: getRoleColor(user?.role || ''),
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          </Box>
        </Box>

        {user?.role === 'EMPLOYEE' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalanceWallet 
                sx={{ 
                  color: theme.palette.success.main, 
                  mr: 1.5,
                  fontSize: '1.2rem'
                }} 
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Food Card
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available Balance
                </Typography>
              </Box>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.success.main,
                fontSize: '1.1rem'
              }}
            >
              ₹{user?.foodCardBalance || 0}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, py: 2 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            px: 3, 
            mb: 1, 
            display: 'block',
            fontWeight: 600,
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.75rem'
          }}
        >
          Navigation
        </Typography>
        
        <List sx={{ px: 1.5 }}>
          {filteredNavigationItems.map((item) => {
            const selected = isSelected(item.path);
            
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={selected}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: selected 
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`
                        : alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateX(4px)',
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                        transform: 'scale(1.1)',
                      },
                    },
                    '&.Mui-selected': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 100%)`,
                      color: theme.palette.primary.main,
                      boxShadow: `inset 3px 0 0 ${theme.palette.primary.main}`,
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: selected ? 600 : 500,
                      fontSize: '0.95rem',
                      color: selected ? theme.palette.primary.main : theme.palette.text.primary,
                    }}
                  />
                  
                  {item.badge && (
                    <Chip
                      label={item.path === '/vendor-portal' 
                        ? `${item.badge} pending` 
                        : item.badge}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: item.path === '/vendor-portal' 
                          ? theme.palette.warning.main
                          : item.isNew 
                            ? theme.palette.success.main 
                            : theme.palette.error.main,
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 1,
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box 
        sx={{ 
          p: 3, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background: alpha(theme.palette.background.paper, 0.6),
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 2,
            px: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.secondary.main, 0.06)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <TrendingUp sx={{ color: theme.palette.success.main, mr: 1, fontSize: '1.2rem' }} />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              System Status
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: theme.palette.success.main, fontWeight: 600 }}>
              All Systems Operational
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 