import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Grid,
  Alert,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
} from '@mui/material';
import { 
  Save, 
  Notifications, 
  DarkMode, 
  Security, 
  AccountCircle,
  Email,
  Smartphone,
  Schedule,
  Restaurant,
  Payment,
  Language,
  LightMode,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { isDarkMode, setDarkMode } = useCustomTheme();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderReminders: true,
    dailyMenuNotifications: true,
    promotionalEmails: false,
    weeklyDigest: true,
    darkMode: isDarkMode,
    language: 'english',
    currency: 'INR',
    autoRecharge: false,
    lowBalanceAlert: true,
    soundNotifications: true,
  });

  // Sync local settings with theme context
  useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode: isDarkMode }));
  }, [isDarkMode]);

  const [personalInfo, setPersonalInfo] = useState({
    phoneNumber: user?.phoneNumber || '',
    department: user?.department || '',
    floorId: user?.floorId || '',
    emergencyContact: '',
    dietaryPreferences: '',
  });

  const [adminSettings, setAdminSettings] = useState({
    systemMaintenance: false,
    userRegistration: true,
    orderLimits: true,
    vendorApproval: true,
    analyticsTracking: true,
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    
    if (setting === 'darkMode') {
      setDarkMode(newValue);
    }
    
    setSettings(prev => ({
      ...prev,
      [setting]: newValue,
    }));
  };

  const handleAdminSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminSettings(prev => ({
      ...prev,
      [setting]: event.target.checked,
    }));
  };

  const handlePersonalInfoChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement API call to save settings
    // Theme is already saved automatically via localStorage in ThemeContext
    setShowSuccessMessage(true);
  };

  const handleSavePersonalInfo = () => {
    // TODO: Implement API call to update user profile
    setShowSuccessMessage(true);
  };

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'CAFETERIA_MANAGER';

  const notificationSettings = [
    {
      key: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: <Email />,
    },
    {
      key: 'pushNotifications',
      label: 'Push Notifications',
      description: 'Browser and mobile push notifications',
      icon: <Smartphone />,
    },
    {
      key: 'orderReminders',
      label: 'Order Reminders',
      description: 'Remind me about pending orders',
      icon: <Schedule />,
    },
    {
      key: 'dailyMenuNotifications',
      label: 'Daily Menu Updates',
      description: 'Get notified about new menu items',
      icon: <Restaurant />,
    },
    {
      key: 'soundNotifications',
      label: 'Sound Notifications',
      description: 'Play sound for notifications',
      icon: <Notifications />,
    },
  ];

  const employeeNotificationSettings = [
    {
      key: 'promotionalEmails',
      label: 'Promotional Emails',
      description: 'Special offers and discounts',
      icon: <Email />,
    },
    {
      key: 'weeklyDigest',
      label: 'Weekly Digest',
      description: 'Summary of your weekly orders',
      icon: <Schedule />,
    },
  ];

  const paymentSettings = [
    {
      key: 'autoRecharge',
      label: 'Auto Recharge',
      description: 'Automatically recharge when balance is low',
      icon: <Payment />,
    },
    {
      key: 'lowBalanceAlert',
      label: 'Low Balance Alert',
      description: 'Alert when food card balance is low',
      icon: <Payment />,
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Manage your account preferences and notifications
      </Typography>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>

              <List>
                {notificationSettings.map((setting) => (
                  <ListItem key={setting.key} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {setting.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={setting.label}
                      secondary={setting.description}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings[setting.key as keyof typeof settings] as boolean}
                        onChange={handleSettingChange(setting.key)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {user?.role === 'EMPLOYEE' && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Additional Preferences
                  </Typography>
                  <List>
                    {employeeNotificationSettings.map((setting) => (
                      <ListItem key={setting.key} sx={{ px: 0 }}>
                        <ListItemIcon>
                          {setting.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={setting.label}
                          secondary={setting.description}
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings[setting.key as keyof typeof settings] as boolean}
                            onChange={handleSettingChange(setting.key)}
                            color="primary"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                sx={{ mt: 2 }}
              >
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment & Food Card Settings (Employee Only) */}
        {user?.role === 'EMPLOYEE' && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Payment sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Food Card & Payments</Typography>
                </Box>

                <List>
                  {paymentSettings.map((setting) => (
                    <ListItem key={setting.key} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {setting.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={setting.label}
                        secondary={setting.description}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings[setting.key as keyof typeof settings] as boolean}
                          onChange={handleSettingChange(setting.key)}
                          color="primary"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Auto Recharge Amount"
                    placeholder="₹500"
                    variant="outlined"
                    size="small"
                    helperText="Amount to recharge when balance goes below ₹100"
                  />
                </Box>

                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  sx={{ mt: 2 }}
                >
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DarkMode sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Appearance</Typography>
              </Box>

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    {isDarkMode ? <DarkMode /> : <LightMode />}
                  </ListItemIcon>
                  <ListItemText
                    primary="Dark Mode"
                    secondary={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.darkMode}
                      onChange={handleSettingChange('darkMode')}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  <ListItemText
                    primary="Language"
                    secondary="Choose your preferred language"
                  />
                </ListItem>
              </List>

              <TextField
                fullWidth
                select
                label="Language"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="tamil">தமிழ்</option>
                <option value="bengali">বাংলা</option>
              </TextField>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                sx={{ mt: 1 }}
              >
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccountCircle sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Personal Information</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={personalInfo.phoneNumber}
                    onChange={handlePersonalInfoChange('phoneNumber')}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={personalInfo.department}
                    onChange={handlePersonalInfoChange('department')}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Floor"
                    value={personalInfo.floorId}
                    onChange={handlePersonalInfoChange('floorId')}
                    variant="outlined"
                  />
                </Grid>
                {user?.role === 'EMPLOYEE' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Emergency Contact"
                        value={personalInfo.emergencyContact}
                        onChange={handlePersonalInfoChange('emergencyContact')}
                        variant="outlined"
                        placeholder="Emergency contact number"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Dietary Preferences"
                        value={personalInfo.dietaryPreferences}
                        onChange={handlePersonalInfoChange('dietaryPreferences')}
                        variant="outlined"
                        placeholder="Vegetarian, Vegan, No Nuts, etc."
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSavePersonalInfo}
                sx={{ mt: 2 }}
              >
                Update Personal Info
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin-only Settings */}
        {isAdminOrManager && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Security sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6" color="warning.main">
                    Administrative Settings
                  </Typography>
                </Box>

                <Paper sx={{ p: 2, bgcolor: 'warning.light', mb: 2 }}>
                  <Typography variant="body2" color="warning.dark">
                    ⚠️ These settings affect the entire system. Please use with caution.
                  </Typography>
                </Paper>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={adminSettings.systemMaintenance}
                          onChange={handleAdminSettingChange('systemMaintenance')}
                          color="warning"
                        />
                      }
                      label="System Maintenance Mode"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={adminSettings.userRegistration}
                          onChange={handleAdminSettingChange('userRegistration')}
                        />
                      }
                      label="Allow User Registration"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={adminSettings.orderLimits}
                          onChange={handleAdminSettingChange('orderLimits')}
                        />
                      }
                      label="Enable Order Limits"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={adminSettings.vendorApproval}
                          onChange={handleAdminSettingChange('vendorApproval')}
                        />
                      }
                      label="Require Vendor Approval"
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  sx={{ mt: 2 }}
                >
                  Save Admin Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage; 