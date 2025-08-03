import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Rating,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Paper,
  Stack,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  Favorite,
  FavoriteBorder,
  Add,
  Remove,
  ShoppingCart,
  LocalOffer,
  Circle,
  Restaurant,
  Timer,
  Star,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import paymentService from '../services/paymentService';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vendor: string;
  rating: number;
  reviews: number;
  isVegetarian: boolean;
  preparationTime: number;
  tags: string[];
  isAvailable: boolean;
  discount?: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const MenuPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([1, 3, 5]); // Mock favorites
  const [showCart, setShowCart] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Mock menu data
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Veg Thali',
      description: 'Complete vegetarian meal with dal, rice, roti, vegetables, and dessert',
      price: 120,
      image: '/api/placeholder/300/200',
      category: 'North Indian',
      vendor: 'North Indian Corner',
      rating: 4.5,
      reviews: 124,
      isVegetarian: true,
      preparationTime: 15,
      tags: ['Popular', 'Healthy'],
      isAvailable: true,
      discount: 10,
    },
    {
      id: 2,
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice with tender chicken pieces and fragrant spices',
      price: 180,
      image: '/api/placeholder/300/200',
      category: 'North Indian',
      vendor: 'North Indian Corner',
      rating: 4.7,
      reviews: 89,
      isVegetarian: false,
      preparationTime: 25,
      tags: ['Spicy', 'Popular'],
      isAvailable: true,
    },
    {
      id: 3,
      name: 'Masala Dosa',
      description: 'Crispy crepe filled with spiced potato stuffing, served with chutney',
      price: 80,
      image: '/api/placeholder/300/200',
      category: 'South Indian',
      vendor: 'South Indian Express',
      rating: 4.3,
      reviews: 156,
      isVegetarian: true,
      preparationTime: 12,
      tags: ['Crispy', 'Traditional'],
      isAvailable: true,
    },
    {
      id: 4,
      name: 'Paneer Roll',
      description: 'Soft roll filled with spiced paneer, onions, and tangy sauces',
      price: 90,
      image: '/api/placeholder/300/200',
      category: 'Street Food',
      vendor: 'Street Food Hub',
      rating: 4.1,
      reviews: 67,
      isVegetarian: true,
      preparationTime: 8,
      tags: ['Quick', 'Spicy'],
      isAvailable: true,
    },
    {
      id: 5,
      name: 'Filter Coffee',
      description: 'Authentic South Indian filter coffee with perfect milk-to-coffee ratio',
      price: 25,
      image: '/api/placeholder/300/200',
      category: 'Beverages',
      vendor: 'Beverages Corner',
      rating: 4.6,
      reviews: 203,
      isVegetarian: true,
      preparationTime: 3,
      tags: ['Hot', 'Energizing'],
      isAvailable: true,
    },
    {
      id: 6,
      name: 'Pasta Alfredo',
      description: 'Creamy pasta with white sauce, mushrooms, and herbs',
      price: 150,
      image: '/api/placeholder/300/200',
      category: 'Continental',
      vendor: 'Continental Corner',
      rating: 4.2,
      reviews: 45,
      isVegetarian: true,
      preparationTime: 18,
      tags: ['Creamy', 'Italian'],
      isAvailable: false,
    },
  ];

  const categories = ['All', 'North Indian', 'South Indian', 'Street Food', 'Beverages', 'Continental'];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getCartItemQuantity = (itemId: number) => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || !user) return;

    setIsProcessingPayment(true);

    try {
      const result = await paymentService.payForOrder(
        getTotalPrice(),
        {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phoneNumber,
        }
      );

      if (result.success) {
        // Clear cart on successful payment
        setCartItems([]);
        setShowCart(false);
        // TODO: Create order record and navigate to order confirmation
        alert('Order placed successfully!');
      } else {
        alert(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Today's Menu
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Fresh meals prepared by our trusted vendors
      </Typography>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search for dishes, vendors, or ingredients..."
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
          <Grid item xs={12} md={6}>
            <Tabs
              value={selectedCategory}
              onChange={(_, newValue) => setSelectedCategory(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {categories.map((category) => (
                <Tab key={category} label={category} value={category} />
              ))}
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Menu Items Grid */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => {
          const quantity = getCartItemQuantity(item.id);
          const isFavorite = favorites.includes(item.id);

          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  opacity: item.isAvailable ? 1 : 0.6,
                  position: 'relative',
                }}
              >
                {/* Discount Badge */}
                {item.discount && (
                  <Chip
                    label={`${item.discount}% OFF`}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1,
                    }}
                  />
                )}

                {/* Favorite Button */}
                <IconButton
                  onClick={() => toggleFavorite(item.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'white',
                    zIndex: 1,
                    '&:hover': { bgcolor: 'white' },
                  }}
                >
                  {isFavorite ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>

                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                  sx={{ bgcolor: 'grey.200' }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {item.name}
                    </Typography>
                    {item.isVegetarian && (
                      <Circle sx={{ color: 'green', ml: 1, fontSize: 12 }} />
                    )}
                  </Box>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>

                  {/* Rating and Reviews */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={item.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      {item.rating} ({item.reviews} reviews)
                    </Typography>
                  </Box>

                  {/* Vendor and Preparation Time */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Restaurant sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
                      {item.vendor}
                    </Typography>
                    <Timer sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {item.preparationTime} min
                    </Typography>
                  </Box>

                  {/* Tags */}
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {item.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>

                  {/* Price and Add to Cart */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" color="primary">
                        ₹{item.discount ? (item.price * (100 - item.discount) / 100).toFixed(0) : item.price}
                      </Typography>
                      {item.discount && (
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                          ₹{item.price}
                        </Typography>
                      )}
                    </Box>

                    {item.isAvailable ? (
                      quantity > 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton onClick={() => removeFromCart(item.id)} size="small">
                            <Remove />
                          </IconButton>
                          <Typography sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}>
                            {quantity}
                          </Typography>
                          <IconButton onClick={() => addToCart(item)} size="small">
                            <Add />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => addToCart(item)}
                          size="small"
                        >
                          Add
                        </Button>
                      )
                    ) : (
                      <Chip label="Not Available" color="default" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Restaurant sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No items found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <Fab
          color="primary"
          onClick={() => setShowCart(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
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
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Order
          </Typography>
          <Divider />

          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id} sx={{ px: 0 }}>
                <Avatar src={item.image} sx={{ mr: 2 }} />
                <ListItemText
                  primary={item.name}
                  secondary={`₹${item.price} × ${item.quantity}`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => removeFromCart(item.id)} size="small">
                    <Remove />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton onClick={() => addToCart(item)} size="small">
                    <Add />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>

          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Total: ₹{getTotalPrice()}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={cartItems.length === 0 || isProcessingPayment}
              onClick={handleCheckout}
              startIcon={isProcessingPayment ? <CircularProgress size={20} /> : null}
            >
              {isProcessingPayment ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MenuPage; 