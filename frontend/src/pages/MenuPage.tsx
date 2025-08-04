import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
  IconButton,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Restaurant, Remove } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addToCart, updateQuantity, removeFromCart } from '../store/slices/orderSlice';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  prepTime: number;
}

const MenuPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentOrder } = useAppSelector((state) => state.order);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice with tender chicken pieces',
      price: 180,
      category: 'Main Course',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 25,
    },
    {
      id: '2',
      name: 'Paneer Butter Masala',
      description: 'Creamy tomato curry with cottage cheese',
      price: 140,
      category: 'Main Course',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 15,
    },
    {
      id: '3',
      name: 'Dal Tadka',
      description: 'Yellow lentils tempered with spices',
      price: 80,
      category: 'Dal',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 10,
    },
    {
      id: '4',
      name: 'Masala Chai',
      description: 'Traditional Indian spiced tea',
      price: 25,
      category: 'Beverages',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 5,
    },
    {
      id: '5',
      name: 'Masala Dosa',
      description: 'Crispy rice crepe with spiced potato filling',
      price: 120,
      category: 'South Indian',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: true,
      prepTime: 20,
    },
    {
      id: '6',
      name: 'Chole Bhature',
      description: 'Spicy chickpea curry with fried bread',
      price: 160,
      category: 'North Indian',
      imageUrl: '/api/placeholder/300/200',
      isAvailable: false,
      prepTime: 15,
    },
  ];

  const handleAddToCart = (item: MenuItem) => {
    const orderItem = {
      id: `${item.id}_${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      quantity: 1,
      price: item.price,
    };

    dispatch(addToCart(orderItem));
    setAddedItemName(item.name);
    setShowAddedToCart(true);
  };

  const handleUpdateQuantity = (menuItemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(menuItemId));
    } else {
      dispatch(updateQuantity({ menuItemId, quantity: newQuantity }));
    }
  };

  const getItemQuantityInCart = (menuItemId: string) => {
    const cartItem = currentOrder.find(item => item.menuItemId === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const renderQuantityControls = (item: MenuItem) => {
    const quantity = getItemQuantityInCart(item.id);
    
    if (quantity === 0) {
      return (
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          disabled={!item.isAvailable}
          onClick={() => handleAddToCart(item)}
        >
          Add to Cart
        </Button>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <Remove />
        </IconButton>
        <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
          {quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <Add />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Today's Menu
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Fresh and delicious food prepared with love
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
            }}>
              {getItemQuantityInCart(item.id) > 0 && (
                <Badge
                  badgeContent={getItemQuantityInCart(item.id)}
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    '& .MuiBadge-badge': {
                      bgcolor: 'success.main',
                      color: 'white',
                      fontSize: '0.75rem',
                    }
                  }}
                />
              )}
              
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  backgroundColor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Restaurant sx={{ fontSize: 60, color: 'grey.500' }} />
              </CardMedia>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {item.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={item.category} size="small" color="primary" variant="outlined" />
                  <Chip label={`${item.prepTime} min`} size="small" color="default" />
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{item.price}
                    </Typography>
                    <Chip 
                      label={item.isAvailable ? 'Available' : 'Out of Stock'} 
                      color={item.isAvailable ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  
                  {renderQuantityControls(item)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {menuItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Restaurant sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No menu items available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Check back later for today's specials
          </Typography>
        </Box>
      )}

      <Snackbar
        open={showAddedToCart}
        autoHideDuration={2000}
        onClose={() => setShowAddedToCart(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowAddedToCart(false)} severity="success">
          {addedItemName} added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuPage; 