import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Pagination,
  InputAdornment,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Visibility,
  VisibilityOff,
  Restaurant,
  PhotoCamera,
} from '@mui/icons-material';
import { MenuItem, MenuItemRequest, menuService } from '../services/menuService';

interface VendorMenuManagementProps {
  vendorId?: number;
}

const VendorMenuManagement: React.FC<VendorMenuManagementProps> = ({ vendorId }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | undefined>(undefined);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemRequest>({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    isAvailable: true,
    preparationTime: 0,
    calories: 0,
    proteinGrams: 0,
    fatGrams: 0,
    carbsGrams: 0,
    ingredients: [],
    tags: [],
  });

  // Load data
  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, [page, searchTerm, categoryFilter, availabilityFilter]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      console.log('Loading vendor menu items...');
      
      const response = await menuService.getMyMenuItems({
        page,
        size: 12,
        sortBy: 'name',
        sortDir: 'asc',
      });
      
      console.log('Menu items response:', response);
      
      // Filter locally if needed (since backend might not support all filters)
      let filteredItems = response.content;
      
      if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (categoryFilter) {
        filteredItems = filteredItems.filter(item => item.category === categoryFilter);
      }
      
      if (availabilityFilter !== undefined) {
        filteredItems = filteredItems.filter(item => item.isAvailable === availabilityFilter);
      }
      
      setMenuItems(filteredItems);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      
      console.log('Loaded', filteredItems.length, 'menu items');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Unknown error';
      setError(`Failed to load menu items: ${errorMessage}`);
      console.error('Error loading menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await menuService.getMenuCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl || '',
        isAvailable: item.isAvailable,
        preparationTime: item.preparationTime || 0,
        calories: item.calories || 0,
        proteinGrams: item.proteinGrams || 0,
        fatGrams: item.fatGrams || 0,
        carbsGrams: item.carbsGrams || 0,
        ingredients: item.ingredients || [],
        tags: item.tags || [],
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        isAvailable: true,
        preparationTime: 0,
        calories: 0,
        proteinGrams: 0,
        fatGrams: 0,
        carbsGrams: 0,
        ingredients: [],
        tags: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      console.log('Saving menu item:', formData);
      
      if (editingItem) {
        console.log('Updating existing item:', editingItem.id);
        await menuService.updateMenuItem(editingItem.id, formData);
        setSuccess('Menu item updated successfully! It will be visible to employees.');
      } else {
        console.log('Creating new menu item');
        const result = await menuService.createMenuItem(formData);
        console.log('Menu item created:', result);
        setSuccess('Menu item added successfully! It is now visible to employees.');
      }
      
      handleCloseDialog();
      console.log('Reloading menu items...');
      await loadMenuItems();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'An error occurred';
      console.error('Error saving menu item:', err);
      console.error('Error details:', {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data
      });
      setError(editingItem ? `Failed to update menu item: ${errorMessage}` : `Failed to create menu item: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
    
    try {
      setLoading(true);
      await menuService.deleteMenuItem(id);
      setSuccess('Menu item deleted successfully');
      loadMenuItems();
    } catch (err) {
      setError('Failed to delete menu item');
      console.error('Error deleting menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      await menuService.toggleAvailability(id);
      setSuccess('Availability updated successfully');
      loadMenuItems();
    } catch (err) {
      setError('Failed to update availability');
      console.error('Error toggling availability:', err);
    }
  };

  const handleInputChange = (field: keyof MenuItemRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (field: 'ingredients' | 'tags', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Menu Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Menu Item
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MuiMenuItem value="">All Categories</MuiMenuItem>
                {categories.map((category) => (
                  <MuiMenuItem key={category} value={category}>
                    {category}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                value={availabilityFilter === undefined ? '' : availabilityFilter.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setAvailabilityFilter(value === '' ? undefined : value === 'true');
                }}
                label="Availability"
              >
                <MuiMenuItem value="">All Items</MuiMenuItem>
                <MuiMenuItem value="true">Available</MuiMenuItem>
                <MuiMenuItem value="false">Unavailable</MuiMenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setAvailabilityFilter(undefined);
                setPage(0);
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Menu Items Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {item.imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.imageUrl}
                      alt={item.name}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" component="h2" noWrap>
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.isAvailable ? 'Available' : 'Unavailable'}
                        color={item.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      ₹{item.price}
                    </Typography>
                    <Chip label={item.category} size="small" sx={{ mb: 1 }} />
                    {item.preparationTime && (
                      <Typography variant="caption" display="block">
                        Prep time: {item.preparationTime} mins
                      </Typography>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Toggle Availability">
                      <IconButton
                        onClick={() => handleToggleAvailability(item.id)}
                        color={item.isAvailable ? 'success' : 'error'}
                      >
                        {item.isAvailable ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenDialog(item)} color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(item.id)} color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_, newPage) => setPage(newPage - 1)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MuiMenuItem key={category} value={category}>
                      {category}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Preparation Time (minutes)"
                type="number"
                value={formData.preparationTime}
                onChange={(e) => handleInputChange('preparationTime', parseInt(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhotoCamera />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Calories"
                type="number"
                value={formData.calories}
                onChange={(e) => handleInputChange('calories', parseInt(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Protein (g)"
                type="number"
                value={formData.proteinGrams}
                onChange={(e) => handleInputChange('proteinGrams', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fat (g)"
                type="number"
                value={formData.fatGrams}
                onChange={(e) => handleInputChange('fatGrams', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Carbs (g)"
                type="number"
                value={formData.carbsGrams}
                onChange={(e) => handleInputChange('carbsGrams', parseFloat(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                  />
                }
                label="Available"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ingredients (comma-separated)"
                value={formData.ingredients?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('ingredients', e.target.value)}
                placeholder="tomato, onion, cheese"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                placeholder="spicy, vegetarian, popular"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : (editingItem ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={8000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorMenuManagement;
