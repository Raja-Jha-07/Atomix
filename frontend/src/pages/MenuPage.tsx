import React, { useState, useMemo } from 'react';
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
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Fab,
  Badge,
  Stack,
  Rating,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Snackbar,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Remove,
  ShoppingCart,
  Restaurant,
  AccessTime,
  LocalOffer,
  Circle,
  AccountBalanceWallet,
  CreditCard,
  CheckCircle,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../store/slices/authSlice';
import { paymentService } from '../services/paymentService';
import orderService from '../services/orderService';

interface MenuItemType {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vendor: string;
  rating: number;
  prepTime: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  tags: string[];
  discount?: number;
}

interface CartItem extends MenuItemType {
  quantity: number;
}

const MenuPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'food_card' | 'external'>('food_card');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning'>('success');

  // Mock menu items data
  const menuItems: MenuItemType[] = useMemo(() => [
    {
      id: 1,
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken pieces, served with basmati rice',
      price: 180,
      image: '/api/placeholder/300/200',
      category: 'Main Course',
      vendor: 'North Indian Corner',
      rating: 4.5,
      prepTime: 15,
      isVegetarian: false,
      isAvailable: true,
      tags: ['Spicy', 'Popular', 'Protein Rich'],
      discount: 10
    },
    {
      id: 2,
      name: 'Masala Dosa',
      description: 'Crispy rice and lentil crepe filled with spiced potato curry, served with chutneys',
      price: 80,
      image: '/api/placeholder/300/200',
      category: 'South Indian',
      vendor: 'South Indian Express',
      rating: 4.7,
      prepTime: 10,
      isVegetarian: true,
      isAvailable: true,
      tags: ['Crispy', 'Traditional', 'Light'],
    },
    {
      id: 3,
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese marinated in aromatic spices and yogurt',
      price: 150,
      image: '/api/placeholder/300/200',
      category: 'Appetizers',
      vendor: 'Grill Master',
      rating: 4.3,
      prepTime: 12,
      isVegetarian: true,
      isAvailable: true,
      tags: ['Grilled', 'Healthy', 'Protein Rich'],
    },
    {
      id: 4,
      name: 'Biryani',
      description: 'Aromatic basmati rice cooked with tender meat and exotic spices',
      price: 200,
      image: '/api/placeholder/300/200',
      category: 'Main Course',
      vendor: 'Biryani House',
      rating: 4.8,
      prepTime: 20,
      isVegetarian: false,
      isAvailable: false,
      tags: ['Fragrant', 'Traditional', 'Heavy'],
    },
  ], []);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const vendors = ['All', ...Array.from(new Set(menuItems.map(item => item.vendor)))];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesVendor = selectedVendor === 'All' || item.vendor === selectedVendor;
      
      return matchesSearch && matchesCategory && matchesVendor;
    });
  }, [menuItems, searchTerm, selectedCategory, selectedVendor]);

  const addToCart = (item: MenuItemType) => {
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
    return cartItems.reduce((total, item) => {
      const price = item.discount ? (item.price * (100 - item.discount) / 100) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePaymentMethodConfirm = () => {
    setShowPaymentDialog(false);
    if (paymentMethod === 'food_card') {
      handleFoodCardPayment();
    } else {
      handleExternalPayment();
    }
  };

  const handleFoodCardPayment = async () => {
    if (!user) return;

    const totalAmount = getTotalPrice();
    const currentBalance = user.foodCardBalance || 0;

    if (currentBalance < totalAmount) {
      setAlertMessage(`Insufficient food card balance. Current: ₹${currentBalance}, Required: ₹${totalAmount}`);
      setAlertSeverity('warning');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create order using order service
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item.id,
          name: item.name,
          price: item.discount ? (item.price * (100 - item.discount) / 100) : item.price,
          quantity: item.quantity,
          vendor: item.vendor
        })),
        totalAmount,
        paymentMethod: 'FOOD_CARD' as const,
        paymentStatus: 'COMPLETED' as const
      };

      const orderResult = await orderService.createOrder(orderData);

      if (orderResult.success) {
        // Update food card balance
        const balanceResult = await orderService.updateFoodCardBalance(totalAmount);
        
        if (balanceResult.success && user) {
          // Update user balance in Redux store
          dispatch(updateUser({
            ...user,
            foodCardBalance: balanceResult.newBalance || (currentBalance - totalAmount)
          }));
        }

        // Clear cart and show success
        setCartItems([]);
        setShowCart(false);
        setOrderSuccess(true);
        setAlertMessage(`Order placed successfully! ₹${totalAmount} deducted from food card.`);
        setAlertSeverity('success');

        // Navigate to orders page after 2 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 2000);

      } else {
        setAlertMessage(orderResult.error || 'Failed to create order');
        setAlertSeverity('error');
      }

    } catch (error) {
      console.error('Food card payment error:', error);
      setAlertMessage('Payment failed. Please try again.');
      setAlertSeverity('error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleExternalPayment = async () => {
    if (!user) return;

    setIsProcessingPayment(true);

    try {
      const result = await paymentService.createPayment({
        amount: getTotalPrice(),
        paymentMethod: 'RAZORPAY',
        paymentType: 'ORDER_PAYMENT',
        description: `Order payment for ${cartItems.length} items`
      });

      if (result.paymentStatus === 'COMPLETED') {
        // Payment was successful (Food Card payment)
        await handleSuccessfulPayment(result);
      } else if (result.paymentStatus === 'PENDING') {
        // Handle Razorpay payment flow
        if (result.razorpayKeyId && result.gatewayOrderId) {
          await paymentService.processRazorpayPayment(
            result,
            async (verifiedPayment) => {
              await handleSuccessfulPayment(verifiedPayment);
            },
            (error) => {
              setAlertMessage(error.message || 'Payment verification failed');
              setAlertSeverity('error');
              setIsProcessingPayment(false);
            }
          );
        } else {
          setAlertMessage('Payment initialization failed');
          setAlertSeverity('error');
          setIsProcessingPayment(false);
        }
      } else {
        setAlertMessage(result.failureReason || 'Payment failed');
        setAlertSeverity('error');
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('External payment error:', error);
      setAlertMessage('An error occurred during payment. Please try again.');
      setAlertSeverity('error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSuccessfulPayment = async (paymentResult: any) => {
    try {
      // Create order using order service
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item.id,
          name: item.name,
          price: item.discount ? (item.price * (100 - item.discount) / 100) : item.price,
          quantity: item.quantity,
          vendor: item.vendor
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: 'RAZORPAY' as const,
        paymentStatus: 'COMPLETED' as const,
        razorpayPaymentId: paymentResult.gatewayPaymentId || paymentResult.paymentId,
        razorpayOrderId: paymentResult.gatewayOrderId || paymentResult.paymentId
      };

      const orderResult = await orderService.createOrder(orderData);

      if (orderResult.success) {
        // Clear cart and show success
        setCartItems([]);
        setShowCart(false);
        setOrderSuccess(true);
        setAlertMessage('Order placed successfully! Payment completed.');
        setAlertSeverity('success');

        // Navigate to orders page after 2 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        setAlertMessage(orderResult.error || 'Failed to create order');
        setAlertSeverity('error');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setAlertMessage('Payment successful but failed to create order. Please contact support.');
      setAlertSeverity('error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0 || !user) return;
    setShowPaymentDialog(true);
  };

  const currentBalance = user?.foodCardBalance || 0;
  const totalAmount = getTotalPrice();
  const hasInsufficientBalance = currentBalance < totalAmount;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Today's Menu
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Fresh meals prepared by our trusted vendors
      </Typography>

      {/* Search and Filter Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search for dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
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
            >
              {vendors.map(vendor => (
                <MenuItem key={vendor} value={vendor}>{vendor}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="textSecondary">
              {filteredItems.length} items found
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Menu Items Grid */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => {
          const quantity = getItemQuantity(item.id);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                  sx={{ position: 'relative' }}
                />
                
                {/* Discount Badge */}
                {item.discount && (
                  <Chip
                    icon={<LocalOffer />}
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

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Item Name and Vendor */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {item.vendor}
                      </Typography>
                    </Box>
                    {item.isVegetarian && (
                      <Circle sx={{ color: 'green', fontSize: 16, ml: 1 }} />
                    )}
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {item.description}
                  </Typography>

                  {/* Rating and Prep Time */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={item.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {item.rating}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {item.prepTime} min
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tags */}
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap' }}>
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
                  secondary={`₹${item.discount ? (item.price * (100 - item.discount) / 100).toFixed(0) : item.price} × ${item.quantity}`}
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
            
            {user && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Food Card Balance: ₹{currentBalance}
              </Typography>
            )}

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

      {/* Payment Method Selection Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Choose Payment Method</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Order Total: ₹{totalAmount}
          </Typography>

          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as 'food_card' | 'external')}
          >
            <FormControlLabel
              value="food_card"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <AccountBalanceWallet sx={{ mr: 2, color: hasInsufficientBalance ? 'error.main' : 'primary.main' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1">
                      Food Card
                    </Typography>
                    <Typography variant="body2" color={hasInsufficientBalance ? 'error' : 'textSecondary'}>
                      Balance: ₹{currentBalance}
                      {hasInsufficientBalance && ' (Insufficient)'}
                    </Typography>
                  </Box>
                </Box>
              }
              disabled={hasInsufficientBalance}
              sx={{ mb: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
            />
            
            <FormControlLabel
              value="external"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCard sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body1">
                      External Payment
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Credit/Debit Card, UPI, Net Banking
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
            />
          </RadioGroup>

          {hasInsufficientBalance && paymentMethod === 'food_card' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>Insufficient Balance</AlertTitle>
              Please recharge your food card or use external payment method.
              <Button 
                size="small" 
                sx={{ ml: 2 }}
                onClick={() => {
                  setShowPaymentDialog(false);
                  setShowCart(false);
                  navigate('/payment');
                }}
              >
                Recharge Now
              </Button>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePaymentMethodConfirm}
            disabled={hasInsufficientBalance && paymentMethod === 'food_card'}
            startIcon={paymentMethod === 'food_card' ? <AccountBalanceWallet /> : <CreditCard />}
          >
            Pay ₹{totalAmount}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={orderSuccess} onClose={() => setOrderSuccess(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Your order has been confirmed and is being prepared.
          </Typography>
          <Button variant="contained" onClick={() => {
            setOrderSuccess(false);
            navigate('/orders');
          }}>
            View Orders
          </Button>
        </DialogContent>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={!!alertMessage} 
        autoHideDuration={6000} 
        onClose={() => setAlertMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alertSeverity} onClose={() => setAlertMessage(null)}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuPage; 