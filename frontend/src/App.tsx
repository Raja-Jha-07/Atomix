import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
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
    <Box className="app-container">
      {isAuthenticated && <Navbar />}
      <Box className="main-content" sx={{ display: 'flex', minHeight: '100vh' }}>
        {isAuthenticated && <Sidebar />}
        <Box component="main" sx={{ flex: 1, p: isAuthenticated ? 2 : 0, overflow: 'auto' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Role-based default route */}
            <Route path="/" element={
              isAuthenticated ? 
                <Navigate to={getRoleBasedRoute()} replace /> : 
                <Navigate to="/login" replace />
            } />
            
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
              <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorPortal />
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE', 'CAFETERIA_MANAGER']}>
                <PaymentPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default App; 