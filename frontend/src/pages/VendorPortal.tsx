import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Store as StoreIcon,
  Pending as PendingIcon,
  CheckCircle as ApprovedIcon,
  Block as SuspendedIcon,
  Analytics as AnalyticsIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { VendorList, VendorForm } from '../components/vendor';
import vendorService, { VendorResponse } from '../services/vendorService';
import { useAppSelector } from '../hooks/redux';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vendor-tabpanel-${index}`}
      aria-labelledby={`vendor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const VendorPortal: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formDialog, setFormDialog] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorResponse | undefined>(undefined);

  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'CAFETERIA_MANAGER';
  const isVendor = user?.role === 'VENDOR';
  
  const hasManagementAccess = isAdmin || isManager;

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (hasManagementAccess) {
        const stats = await vendorService.getVendorStatistics();
        setStatistics(stats);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateVendor = () => {
    setEditingVendor(undefined);
    setFormDialog(true);
  };

  const handleEditVendor = (vendor: VendorResponse) => {
    setEditingVendor(vendor);
    setFormDialog(true);
  };

  const handleFormSave = (vendor: VendorResponse) => {
    setFormDialog(false);
    setEditingVendor(undefined);
    loadStatistics(); // Refresh statistics
  };

  const handleFormCancel = () => {
    setFormDialog(false);
    setEditingVendor(undefined);
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: number | string; 
    icon: React.ReactNode; 
    color?: string;
    subtitle?: string;
  }> = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && !statistics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Vendor Portal
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {hasManagementAccess 
              ? 'Manage vendors, approve registrations, and monitor performance'
              : 'View and manage your vendor information'
            }
          </Typography>
        </Box>
        {hasManagementAccess && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateVendor}
          >
            Add Vendor
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards - Only for Admin/Manager */}
      {hasManagementAccess && statistics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Vendors"
              value={statistics.totalVendors || 0}
              icon={<StoreIcon fontSize="large" />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Vendors"
              value={statistics.activeVendors || 0}
              icon={<ApprovedIcon fontSize="large" />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Approval"
              value={statistics.pendingApproval || 0}
              icon={<PendingIcon fontSize="large" />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Suspended"
              value={statistics.suspendedVendors || 0}
              icon={<SuspendedIcon fontSize="large" />}
              color="error"
            />
          </Grid>
        </Grid>
      )}

      {/* Vendor Type Statistics */}
      {hasManagementAccess && statistics?.vendorTypeStatistics && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Vendor Types Distribution
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {Object.entries(statistics.vendorTypeStatistics).map(([type, count]) => (
                <Chip
                  key={type}
                  label={`${type}: ${count}`}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="vendor portal tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Vendors" />
          {hasManagementAccess && <Tab label="Pending Approval" />}
          <Tab label="Active Vendors" />
          {hasManagementAccess && <Tab label="High Rated" />}
          {hasManagementAccess && <Tab label="Temporary Vendors" />}
        </Tabs>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <VendorList
            showActions={hasManagementAccess}
            onVendorEdit={hasManagementAccess ? handleEditVendor : undefined}
            onVendorCreate={hasManagementAccess ? handleCreateVendor : undefined}
          />
        </TabPanel>

        {hasManagementAccess && (
          <TabPanel value={activeTab} index={1}>
            <VendorList
              showActions={true}
              statusFilter="PENDING"
              onVendorEdit={handleEditVendor}
              onVendorCreate={handleCreateVendor}
            />
          </TabPanel>
        )}

        <TabPanel value={activeTab} index={hasManagementAccess ? 2 : 1}>
          <VendorList
            showActions={hasManagementAccess}
            statusFilter="APPROVED"
            onVendorEdit={hasManagementAccess ? handleEditVendor : undefined}
            onVendorCreate={hasManagementAccess ? handleCreateVendor : undefined}
          />
        </TabPanel>

        {hasManagementAccess && (
          <>
            <TabPanel value={activeTab} index={3}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  High Rated Vendors (4+ stars)
                </Typography>
                <VendorList
                  showActions={true}
                  onVendorEdit={handleEditVendor}
                  onVendorCreate={handleCreateVendor}
                />
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <VendorList
                showActions={true}
                typeFilter="TEMPORARY"
                onVendorEdit={handleEditVendor}
                onVendorCreate={handleCreateVendor}
              />
            </TabPanel>
          </>
        )}
      </Paper>

      {/* Vendor Form Dialog */}
      <Dialog
        open={formDialog}
        onClose={handleFormCancel}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {editingVendor ? 'Edit Vendor' : 'Create New Vendor'}
            </Typography>
            <IconButton onClick={handleFormCancel}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <VendorForm
            vendor={editingVendor}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VendorPortal; 