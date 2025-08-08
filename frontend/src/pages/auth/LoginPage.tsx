import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Container,
  Paper,
  alpha,
  useTheme,
  Chip,
  Stack,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Google, 
  GitHub, 
  RestaurantMenu,
  Security,
  Speed,
  People,
  ArrowForward,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginUser, clearError } from '../../store/slices/authSlice';

interface LoginForm {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // Role-based redirect function
  const getRoleBasedRoute = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'VENDOR':
        return '/vendor-portal';
      case 'CAFETERIA_MANAGER':
        return '/manager-dashboard';
      case 'ADMIN':
        return '/dashboard';
      case 'EMPLOYEE':
      default:
        return '/dashboard';
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // If already authenticated, redirect based on role
  if (isAuthenticated && user) {
    return <Navigate to={getRoleBasedRoute()} replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    console.log('🔥 Form submitted with data:', data);
    console.log('🔥 Current auth state before login:', { isLoading, error, isAuthenticated });
    
    try {
      console.log('🔥 Dispatching loginUser action...');
      const result = await dispatch(loginUser(data));
      console.log('🔥 Login action result:', result);
      
      if (loginUser.fulfilled.match(result)) {
        console.log('✅ Login successful!', result.payload);
      } else if (loginUser.rejected.match(result)) {
        console.log('❌ Login failed:', result.payload);
      }
    } catch (error) {
      console.error('💥 Form submission error:', error);
    }
  };

  const features = [
    {
      icon: <RestaurantMenu sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      title: 'Digital Menu',
      description: 'Browse fresh meals from trusted vendors',
    },
    {
      icon: <Security sx={{ fontSize: 32, color: theme.palette.success.main }} />,
      title: 'Secure Payments',
      description: 'Food card & multiple payment options',
    },
    {
      icon: <Speed sx={{ fontSize: 32, color: theme.palette.warning.main }} />,
      title: 'Quick Orders',
      description: 'Fast ordering with real-time tracking',
    },
    {
      icon: <People sx={{ fontSize: 32, color: theme.palette.info.main }} />,
      title: 'Multi-Role Access',
      description: 'Admin, Manager, Vendor & Employee portals',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
          {/* Left side - Features */}
          <Box 
            sx={{ 
              flex: 1, 
              pr: { xs: 0, md: 6 },
              mb: { xs: 4, md: 0 },
              display: { xs: 'none', md: 'block' }
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ mb: 6 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                }}
              >
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                  A
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}>
                Atomix Cafeteria
              </Typography>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                Digital Food Experience Platform
              </Typography>
              <Chip
                label="Version 2.0"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Features Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
              {features.map((feature, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Stats */}
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                  500+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.success.main }}>
                  50+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Menu Items
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.warning.main }}>
                  98%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Satisfaction
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Right side - Login Form */}
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: 480 } }}>
            <Card 
              sx={{ 
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
                borderRadius: 4,
                background: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                overflow: 'visible',
                position: 'relative',
              }}
            >
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  opacity: 0.8,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -15,
                  left: -15,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`,
                  opacity: 0.6,
                }}
              />

              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to access your cafeteria dashboard
                  </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        fontSize: '0.95rem',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Test Mock Auth Button */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Button 
                    onClick={() => {
                      console.log('🧪 Testing mock auth directly...');
                      onSubmit({ email: 'admin@atomix.com', password: 'password123' });
                    }}
                    variant="outlined"
                    size="small"
                  >
                    🧪 Test Admin
                  </Button>
                  <Button 
                    onClick={() => {
                      console.log('🧪 Testing employee auth...');
                      onSubmit({ email: 'employee@atomix.com', password: 'password123' });
                    }}
                    variant="outlined"
                    size="small"
                  >
                    👨‍💼 Test Employee
                  </Button>
                  <Button 
                    onClick={() => {
                      console.log('🧪 Testing manager auth...');
                      onSubmit({ email: 'manager@atomix.com', password: 'password123' });
                    }}
                    variant="outlined"
                    size="small"
                  >
                    👨‍💼 Test Manager
                  </Button>
                </Stack>

                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register('email')}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.6),
                      },
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register('password')}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.6),
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      mb: 3,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: theme.palette.action.disabledBackground,
                        transform: 'none',
                      },
                    }}
                    endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  {/* Divider */}
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      OR CONTINUE WITH
                    </Typography>
                  </Divider>

                  {/* Social Login Buttons */}
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Google />}
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        borderColor: alpha(theme.palette.divider, 0.3),
                        color: theme.palette.text.primary,
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          background: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      Continue with Google
                    </Button>
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<GitHub />}
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        borderColor: alpha(theme.palette.divider, 0.3),
                        color: theme.palette.text.primary,
                        '&:hover': {
                          borderColor: theme.palette.text.primary,
                          background: alpha(theme.palette.text.primary, 0.04),
                        },
                      }}
                    >
                      Continue with GitHub
                    </Button>
                  </Stack>

                  {/* Register Link */}
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link 
                        to="/register" 
                        style={{ 
                          color: theme.palette.primary.main, 
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Sign up here
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Demo Credentials */}
            <Paper
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                background: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.info.main, mb: 1, display: 'block' }}>
                Demo Credentials
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Admin: admin@atomix.com / password123
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Employee: employee@atomix.com / password123
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Manager: manager@atomix.com / password123
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 