import React, { useState } from 'react';
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
} from '@mui/material';
import { Save, Notifications, DarkMode } from '@mui/icons-material';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    autoOrderReminders: true,
    dailyMenuNotifications: true,
  });

  const [personalInfo, setPersonalInfo] = useState({
    phoneNumber: '',
    floorId: '',
    department: '',
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
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
    setShowSuccessMessage(true);
  };

  const handleSavePersonalInfo = () => {
    // TODO: Implement API call to update user profile
    setShowSuccessMessage(true);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleSettingChange('emailNotifications')}
                  />
                }
                label="Email Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={handleSettingChange('pushNotifications')}
                  />
                }
                label="Push Notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoOrderReminders}
                    onChange={handleSettingChange('autoOrderReminders')}
                  />
                }
                label="Auto Order Reminders"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dailyMenuNotifications}
                    onChange={handleSettingChange('dailyMenuNotifications')}
                  />
                }
                label="Daily Menu Notifications"
              />

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                >
                  Save Notifications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DarkMode sx={{ mr: 1 }} />
                <Typography variant="h6">Appearance</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleSettingChange('darkMode')}
                  />
                }
                label="Dark Mode"
              />

              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Dark mode is currently under development and will be available soon.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Information Update */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Update Personal Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={personalInfo.phoneNumber}
                    onChange={handlePersonalInfoChange('phoneNumber')}
                    placeholder="+1234567890"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Floor ID"
                    value={personalInfo.floorId}
                    onChange={handlePersonalInfoChange('floorId')}
                    placeholder="e.g., F1, F2"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={personalInfo.department}
                    onChange={handlePersonalInfoChange('department')}
                    placeholder="Engineering, HR, etc."
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSavePersonalInfo}
                >
                  Update Information
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Danger Zone
              </Typography>

              <Alert severity="warning" sx={{ mb: 2 }}>
                These actions cannot be undone. Please be careful.
              </Alert>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" color="warning">
                  Change Password
                </Button>
                <Button variant="outlined" color="error">
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        message="Settings saved successfully!"
      />
    </Box>
  );
};

export default SettingsPage; 