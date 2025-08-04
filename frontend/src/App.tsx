import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import VendorPortal from './pages/VendorPortal';
import CafeteriaManagerDashboard from './pages/CafeteriaManagerDashboard';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAppSelector } from './hooks/redux';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Role-based default route
  const getRoleBasedRoute = () => {
    if (!user) return '/login';
    
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        className="app-container" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        {isAuthenticated && <Navbar />}
        <Box 
          className="main-content" 
          sx={{ 
            display: 'flex', 
            flex: 1,
            overflow: 'hidden'
          }}
        >
          {isAuthenticated && <Sidebar />}
          <Box 
            component="main" 
            sx={{ 
              flex: 1, 
              p: isAuthenticated ? 3 : 0, 
              overflow: 'auto',
              background: isAuthenticated ? 'transparent' : 'inherit'
            }}
          >
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/manager-dashboard" element={
                <ProtectedRoute allowedRoles={['CAFETERIA_MANAGER']}>
                  <CafeteriaManagerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/vendor-portal" element={
                <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                  <VendorPortal />
                </ProtectedRoute>
              } />
              
              <Route path="/menu" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE', 'CAFETERIA_MANAGER']}>
                  <MenuPage />
                </ProtectedRoute>
              } />
              
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE', 'VENDOR', 'CAFETERIA_MANAGER']}>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'CAFETERIA_MANAGER']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/payments" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE', 'CAFETERIA_MANAGER']}>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE', 'VENDOR', 'CAFETERIA_MANAGER']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Redirect based on authentication and role */}
              <Route path="/" element={
                isAuthenticated ? 
                  <Navigate to={getRoleBasedRoute()} replace /> : 
                  <Navigate to="/login" replace />
              } />
              
              {/* Catch all route */}
              <Route path="*" element={
                isAuthenticated ? 
                  <Navigate to={getRoleBasedRoute()} replace /> : 
                  <Navigate to="/login" replace />
              } />
            </Routes>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App; 