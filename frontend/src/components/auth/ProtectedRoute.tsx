import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useGetCurrentUserQuery } from '../../store/api/authApi';
import { setUser, logout } from '../../store/slices/authSlice';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Only fetch user data if we have a token but no user data
  const { 
    data: userData, 
    isLoading: isUserLoading, 
    error 
  } = useGetCurrentUserQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (userData && !user) {
      dispatch(setUser(userData));
    }
  }, [userData, user, dispatch]);

  useEffect(() => {
    if (error && token) {
      // If there's an error fetching user data and we have a token, logout
      dispatch(logout());
    }
  }, [error, token, dispatch]);

  if (isUserLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user) {
    const hasRequiredRole = requiredRole.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 