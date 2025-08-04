import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fab,
  Badge,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  Search,
  Add,
  Remove,
  ShoppingCart,
  Restaurant,
  AccessTime,
  FilterList,
} from '@mui/icons-material';
import { menuService, MenuItem } from '../services/menuService';
import { useAppSelector } from '../hooks/redux';

interface CartItem extends MenuItem {
  quantity: number;
}

const EmployeeMenuPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState('All');
  
  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Load data
  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuService.getAllMenuItems({
        page: 0,
        size: 100,
        available: true // Only show available items to employees
      });
      setMenuItems(response.content);
    } catch (err) {
      console.error('Error loading menu items:', err);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await menuService.getMenuCategories();
      setCategories(['All', ...cats]);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Get unique vendors
  const vendors = useMemo(() => {
    const uniqueVendors = Array.from(new Set(menuItems.map(item => item.vendorName).filter(Boolean)));
    return ['All', ...uniqueVendors];
  }, [menuItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesVendor = selectedVendor === 'All' || item.vendorName === selectedVendor;
      
      return matchesSearch && matchesCategory && matchesVendor && item.isAvailable;
    });
  }, [menuItems, searchTerm, selectedCategory, selectedVendor]);

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem => 
          cartItem.id === itemId 
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getItemQuantity = (itemId: number) => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cafeteria Menu
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Browse and order from our delicious menu items
      </Typography>

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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Vendor</InputLabel>
              <Select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                label="Vendor"
              >
                {vendors.map((vendor) => (
                  <MuiMenuItem key={vendor} value={vendor}>
                    {vendor}
                  </MuiMenuItem>
                ))}
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
                setSelectedCategory('All');
                setSelectedVendor('All');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Menu Items Grid */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {item.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  ₹{item.price}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={item.category} size="small" />
                  {item.vendorName && (
                    <Chip label={item.vendorName} size="small" variant="outlined" />
                  )}
                </Stack>
                {item.preparationTime && (
                  <Typography variant="caption" display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <AccessTime sx={{ mr: 0.5, fontSize: 16 }} />
                    {item.preparationTime} mins
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
              <Box sx={{ p: 2, pt: 0 }}>
                {getItemQuantity(item.id) === 0 ? (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => addToCart(item)}
                    disabled={!item.isAvailable}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <IconButton onClick={() => removeFromCart(item.id)} color="primary">
                      <Remove />
                    </IconButton>
                    <Typography variant="h6">
                      {getItemQuantity(item.id)}
                    </Typography>
                    <IconButton onClick={() => addToCart(item)} color="primary">
                      <Add />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Restaurant sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No menu items found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setShowCart(true)}
        >
          <Badge badgeContent={getTotalItems()} color="error">
            <ShoppingCart />
          </Badge>
        </Fab>
      )}

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={showCart}
        onClose={() => setShowCart(false)}
        PaperProps={{ sx: { width: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Cart ({getTotalItems()} items)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id} sx={{ px: 0 }}>
                <ListItemText
                  primary={item.name}
                  secondary={`₹${item.price} x ${item.quantity}`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton size="small" onClick={() => removeFromCart(item.id)}>
                    <Remove />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => addToCart(item)}>
                    <Add />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              ₹{getTotalPrice()}
            </Typography>
          </Box>
          
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearCart}
              disabled={cartItems.length === 0}
            >
              Clear Cart
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeMenuPage;
