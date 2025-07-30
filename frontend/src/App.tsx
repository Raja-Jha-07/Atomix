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
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAppSelector } from './hooks/redux';

const App: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Box className="app-container">
      {isAuthenticated && <Navbar />}
      <Box className="main-content">
        {isAuthenticated && <Sidebar />}
        <Box component="main" sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
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
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/vendor" element={
              <ProtectedRoute>
                <VendorPortal />
              </ProtectedRoute>
            } />
            
            {/* Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default App; 