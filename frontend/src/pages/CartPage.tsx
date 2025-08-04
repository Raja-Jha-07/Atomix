import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Payment,
  ClearAll,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/orderSlice';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentOrder } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);
  
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleUpdateQuantity = (menuItemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(menuItemId));
    } else {
      dispatch(updateQuantity({ menuItemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (menuItemId: string) => {
    dispatch(removeFromCart(menuItemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setClearDialogOpen(false);
  };

  const calculateSubtotal = () => {
    return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.05; // 5% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleCheckout = () => {
    // Navigate to checkout/payment page
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  if (currentOrder.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Add some delicious items from our menu to get started
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleContinueShopping}
          startIcon={<ArrowBack />}
        >
          Browse Menu
        </Button>
      </Box>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Shopping Cart
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {currentOrder.length} {currentOrder.length === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearAll />}
            onClick={() => setClearDialogOpen(true)}
          >
            Clear Cart
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart />
                Order Items
              </Typography>
              
              <List>
                {currentOrder.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" component="div">
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                              ₹{item.price} each
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity - 1)}
                                  sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                >
                                  <Remove fontSize="small" />
                                </IconButton>
                                <Chip 
                                  label={item.quantity} 
                                  variant="outlined" 
                                  sx={{ minWidth: 50, fontWeight: 'bold' }} 
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity + 1)}
                                  sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                >
                                  <Add fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                ₹{item.price * item.quantity}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          color="error"
                          onClick={() => handleRemoveItem(item.menuItemId)}
                          sx={{ '&:hover': { bgcolor: 'error.light', color: 'white' } }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < currentOrder.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Payment />
                Order Summary
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">₹{subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Tax (5%):</Typography>
                  <Typography variant="body1">₹{tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {user?.foodCardBalance && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Food Card Balance: ₹{user.foodCardBalance.toFixed(2)}
                  {user.foodCardBalance < total && (
                    <Typography variant="caption" display="block" color="error">
                      Insufficient balance. Please top up your card.
                    </Typography>
                  )}
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Payment />}
                onClick={handleCheckout}
                sx={{ mb: 1 }}
              >
                Proceed to Checkout
              </Button>
              
              <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center', display: 'block', mt: 1 }}>
                You'll review your order before payment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear Shopping Cart?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearCart} color="error" variant="contained">
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage; 