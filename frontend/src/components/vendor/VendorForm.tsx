import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  FormHelperText,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
} from '@mui/material';
import vendorService, { VendorRequest, VendorResponse } from '../../services/vendorService';

interface VendorFormProps {
  vendor?: VendorResponse;
  onSave?: (vendor: VendorResponse) => void;
  onCancel?: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSave, onCancel }) => {
  const [formData, setFormData] = useState<VendorRequest>({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    contactPerson: '',
    businessLicense: '',
    logoUrl: '',
    operatingHours: '',
    locationDescription: '',
    floorIds: [],
    vendorType: 'PERMANENT',
    temporaryStartDate: undefined,
    temporaryEndDate: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [floorInput, setFloorInput] = useState('');

  // Vendor types and statuses
  const vendorTypes = [
    { value: 'PERMANENT', label: 'Permanent Vendor' },
    { value: 'TEMPORARY', label: 'Temporary Food Stall' },
    { value: 'SEASONAL', label: 'Seasonal Vendor' },
    { value: 'EVENT_BASED', label: 'Event-Based Vendor' },
  ];

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        description: vendor.description || '',
        contactEmail: vendor.contactEmail,
        contactPhone: vendor.contactPhone || '',
        contactPerson: vendor.contactPerson || '',
        businessLicense: vendor.businessLicense || '',
        logoUrl: vendor.logoUrl || '',
        operatingHours: vendor.operatingHours || '',
        locationDescription: vendor.locationDescription || '',
        floorIds: vendor.floorIds || [],
        vendorType: vendor.vendorType,
        temporaryStartDate: vendor.temporaryStartDate,
        temporaryEndDate: vendor.temporaryEndDate,
      });
    }
  }, [vendor]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    if (!formData.vendorType) {
      newErrors.vendorType = 'Vendor type is required';
    }

    // Validate temporary vendor dates
    if (formData.vendorType !== 'PERMANENT') {
      if (!formData.temporaryStartDate) {
        newErrors.temporaryStartDate = 'Start date is required for temporary vendors';
      }
      if (!formData.temporaryEndDate) {
        newErrors.temporaryEndDate = 'End date is required for temporary vendors';
      }
      if (formData.temporaryStartDate && formData.temporaryEndDate) {
        const startDate = new Date(formData.temporaryStartDate);
        const endDate = new Date(formData.temporaryEndDate);
        if (startDate >= endDate) {
          newErrors.temporaryEndDate = 'End date must be after start date';
        }
        if (startDate < new Date()) {
          newErrors.temporaryStartDate = 'Start date cannot be in the past';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      console.log('Creating vendor with data:', formData);
      
      let result: VendorResponse;

      if (vendor) {
        // Update existing vendor
        result = await vendorService.updateVendor(vendor.id, formData);
      } else {
        // Create new vendor
        result = await vendorService.createVendor(formData);
      }

      console.log('Vendor creation successful:', result);
      
      if (onSave) {
        onSave(result);
      }
    } catch (error: any) {
      console.error('Error creating vendor:', error);
      console.error('Error response:', error.response?.data);
      
      // Extract detailed error message
      let errorMessage = 'Failed to create vendor';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.data) {
        errorMessage = error.response.data.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VendorRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddFloor = () => {
    if (floorInput.trim() && !formData.floorIds?.includes(floorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        floorIds: [...(prev.floorIds || []), floorInput.trim()]
      }));
      setFloorInput('');
    }
  };

  const handleRemoveFloor = (floorId: string) => {
    setFormData(prev => ({
      ...prev,
      floorIds: prev.floorIds?.filter(id => id !== floorId) || []
    }));
  };

  const isTemporaryVendor = formData.vendorType !== 'PERMANENT';

  return (
    <Card>
      <CardHeader
        title={vendor ? 'Edit Vendor' : 'Create New Vendor'}
        subheader={vendor ? `Editing ${vendor.name}` : 'Add a new vendor to the system'}
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.vendorType}>
                <InputLabel required>Vendor Type</InputLabel>
                <Select
                  value={formData.vendorType}
                  onChange={(e) => handleInputChange('vendorType', e.target.value)}
                  label="Vendor Type"
                >
                  {vendorTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.vendorType && (
                  <FormHelperText>{errors.vendorType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business License"
                value={formData.businessLicense}
                onChange={(e) => handleInputChange('businessLicense', e.target.value)}
              />
            </Grid>

            {/* Location and Hours */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Location & Hours
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Operating Hours"
                value={formData.operatingHours}
                onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                placeholder="e.g., Mon-Fri: 9AM-6PM"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location Description"
                value={formData.locationDescription}
                onChange={(e) => handleInputChange('locationDescription', e.target.value)}
                placeholder="e.g., Ground floor, near entrance"
              />
            </Grid>

            {/* Floor IDs */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Floor Locations
                </Typography>
                <Box display="flex" gap={1} alignItems="center" mb={2}>
                  <TextField
                    size="small"
                    label="Floor ID"
                    value={floorInput}
                    onChange={(e) => setFloorInput(e.target.value)}
                    placeholder="e.g., F1, F2, etc."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFloor();
                      }
                    }}
                  />
                  <Button variant="outlined" onClick={handleAddFloor}>
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.floorIds?.map((floorId) => (
                    <Chip
                      key={floorId}
                      label={floorId}
                      onDelete={() => handleRemoveFloor(floorId)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Temporary Vendor Dates */}
            {isTemporaryVendor && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Temporary Vendor Schedule
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date & Time"
                    type="datetime-local"
                    value={formData.temporaryStartDate ? formData.temporaryStartDate.slice(0, 16) : ''}
                    onChange={(e) => handleInputChange('temporaryStartDate', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                    error={!!errors.temporaryStartDate}
                    helperText={errors.temporaryStartDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="End Date & Time"
                    type="datetime-local"
                    value={formData.temporaryEndDate ? formData.temporaryEndDate.slice(0, 16) : ''}
                    onChange={(e) => handleInputChange('temporaryEndDate', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                    error={!!errors.temporaryEndDate}
                    helperText={errors.temporaryEndDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </>
            )}

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Logo URL"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                {onCancel && (
                  <Button variant="outlined" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Saving...' : (vendor ? 'Update Vendor' : 'Create Vendor')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VendorForm; 