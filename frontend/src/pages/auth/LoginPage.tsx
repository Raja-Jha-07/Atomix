import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
} from '@mui/material';
import { Visibility, VisibilityOff, Google, GitHub } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials, clearError, setError } from '../../store/slices/authSlice';
import TestCredentials from '../../components/demo/TestCredentials';

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
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const [login, { isLoading }] = useLoginMutation();
  const { error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const from = (location.state as any)?.from?.pathname || '/';
  const successMessage = (location.state as any)?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginForm) => {
    try {
      dispatch(clearError());
      const response = await login(data).unwrap();
      
      // Transform the response to match our user interface
      const user = {
        id: response.id.toString(),
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role as 'EMPLOYEE' | 'VENDOR' | 'ADMIN' | 'CAFETERIA_MANAGER',
      };
      
      dispatch(setCredentials({
        user,
        token: response.token,
        refreshToken: response.refreshToken,
      }));
    } catch (error: any) {
      dispatch(setError(error?.data?.message || 'Login failed'));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/oauth2/${provider}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to Atomix
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign in to your cafeteria account
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
            />
            
            <TextField
              {...register('password')}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
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
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }}>OR</Divider>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                onClick={() => handleOAuthLogin('github')}
                disabled={isLoading}
              >
                GitHub
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Test Credentials Component */}
      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <TestCredentials />
      </Box>
    </Box>
  );
};

export default LoginPage; 