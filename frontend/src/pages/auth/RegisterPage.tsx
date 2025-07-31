import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useRegisterMutation } from '../../store/api/authApi';
import { clearError, setError } from '../../store/slices/authSlice';
import type { SignupRequest } from '../../store/api/authApi';

interface RegisterForm extends SignupRequest {
  confirmPassword: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  role: yup.string().oneOf(['EMPLOYEE', 'VENDOR', 'ADMIN', 'CAFETERIA_MANAGER']).required('Role is required'),
  employeeId: yup.string().required('Employee ID is required'),
  phoneNumber: yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  department: yup.string(),
  floorId: yup.string(),
});

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [register, { isLoading }] = useRegisterMutation();
  const { error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      dispatch(clearError());
      const { confirmPassword, ...registrationData } = data;
      await register(registrationData).unwrap();
      
      // Show success message and redirect to login
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your credentials.' 
        } 
      });
    } catch (error: any) {
      dispatch(setError(error?.data?.message || 'Registration failed'));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Join Atomix
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create your cafeteria account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...registerField('firstName')}
                  fullWidth
                  label="First Name"
                  autoComplete="given-name"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...registerField('lastName')}
                  fullWidth
                  label="Last Name"
                  autoComplete="family-name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  {...registerField('email')}
                  fullWidth
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...registerField('password')}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...registerField('confirmPassword')}
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleToggleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...registerField('role')}
                  select
                  fullWidth
                  label="Role"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  disabled={isLoading}
                >
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                  <MenuItem value="VENDOR">Vendor</MenuItem>
                  <MenuItem value="CAFETERIA_MANAGER">Cafeteria Manager</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...registerField('employeeId')}
                  fullWidth
                  label="Employee ID"
                  error={!!errors.employeeId}
                  helperText={errors.employeeId?.message}
                  disabled={isLoading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...registerField('phoneNumber')}
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  placeholder="+1234567890"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  disabled={isLoading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...registerField('department')}
                  fullWidth
                  label="Department"
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  disabled={isLoading}
                />
              </Grid>
              
              {selectedRole === 'EMPLOYEE' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...registerField('floorId')}
                    fullWidth
                    label="Floor ID"
                    placeholder="e.g., F1, F2, F3"
                    error={!!errors.floorId}
                    helperText={errors.floorId?.message}
                    disabled={isLoading}
                  />
                </Grid>
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage; 