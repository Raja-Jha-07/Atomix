import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Payment,
  ArrowBack,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { clearCart } from '../store/slices/orderSlice';
import { updateUser } from '../store/slices/authSlice';
import { paymentService } from '../services/paymentService';
import orderService, { CreateOrderRequest } from '../services/orderService';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import RazorpayTestInfo from '../components/payment/RazorpayTestInfo';
import { paymentHistoryService } from '../services/paymentHistoryService';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentOrder } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);
  
  const [paymentMethod, setPaymentMethod] = useState<string>('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [orderDetails, setOrderDetails] = useState<{id: number; orderNumber: string} | null>(null);
  
  // Payment confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (currentOrder.length === 0) {
      navigate('/cart');
    }
  }, [currentOrder, navigate]);

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

  const createOrderAfterPayment = async (paymentId?: string, razorpayOrderId?: string) => {
    try {
      const orderData: CreateOrderRequest = {
        items: currentOrder.map(item => ({
          menuItemId: parseInt(item.menuItemId),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          vendor: 'Atomix Cafeteria', // Default vendor name
        })),
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod as any,
        paymentStatus: 'COMPLETED',
        razorpayPaymentId: paymentId,
        razorpayOrderId: razorpayOrderId,
      };

      const result = await orderService.createOrder(orderData);
      if (result.success && result.order) {
        setOrderDetails({
          id: result.order.id,
          orderNumber: result.order.orderNumber
        });
        setPaymentStatus('success');
        
        // Update food card balance if payment was made with food card
        if (paymentMethod === 'FOOD_CARD' && user) {
          const newBalance = (user.foodCardBalance || 0) - calculateTotal();
          dispatch(updateUser({ foodCardBalance: newBalance }));
        }
        
        // Add to payment history
        paymentHistoryService.addPaymentTransaction({
          type: 'ORDER_PAYMENT',
          amount: calculateTotal(),
          paymentMethod: paymentMethod === 'FOOD_CARD' ? 'Food Card' : 'Razorpay',
          status: 'SUCCESS',
          description: `Order Payment - ${currentOrder.length} items`,
          orderId: result.order.id.toString(),
          orderNumber: result.order.orderNumber,
          razorpayPaymentId: razorpayOrderId,
        });
        
        dispatch(clearCart());
        setConfirmDialogOpen(true);
      } else {
        const errorMessage = result.error || 'Failed to create order';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Order creation failed:', error);
      setError('Payment successful but order creation failed. Please contact support.');
      setPaymentStatus('failed');
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      setPaymentStatus('processing');

      const total = calculateTotal();
      
      if (paymentMethod === 'FOOD_CARD') {
        // Food card payment - process immediately
        await createOrderAfterPayment();
      } else if (paymentMethod === 'RAZORPAY') {
        // Create payment order
        const paymentRequest = {
          amount: total,
          paymentMethod: paymentMethod as any,
          paymentType: 'ORDER_PAYMENT' as const,
          description: `Order for ${currentOrder.length} items`
        };

        const paymentResponse = await paymentService.createPayment(paymentRequest);
        
        // Process Razorpay payment
        await paymentService.processRazorpayPayment(
          paymentResponse,
          async (response) => {
            // Payment successful - create order
            await createOrderAfterPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id
            );
          },
          (error) => {
            console.error('Payment failed:', error);
            setError(error.message || 'Payment failed. Please try again.');
            setPaymentStatus('failed');
          }
        );
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = () => {
    setPaymentStatus('idle');
    setError('');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleOrderComplete = () => {
    setConfirmDialogOpen(false);
    navigate('/orders');
  };

  if (currentOrder.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h5" color="textSecondary">
          No items in cart
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/menu')}
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
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <List>
                {currentOrder.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Qty: ${item.quantity}`}
                      />
                      <Typography variant="body1" fontWeight="bold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Summary */}
        <Grid item xs={12} md={5}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">₹{subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax (5%)</Typography>
                  <Typography variant="body2">₹{tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">₹{total.toFixed(2)}</Typography>
                </Box>
              </Box>

              {paymentMethod === 'RAZORPAY' && (
                <Box sx={{ mb: 2 }}>
                  <RazorpayTestInfo />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePayment}
                  disabled={loading || paymentStatus === 'processing'}
                  startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
                  fullWidth
                >
                  {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                </Button>
                
                {paymentStatus === 'failed' && (
                  <Button
                    variant="outlined"
                    onClick={handleRetryPayment}
                    fullWidth
                  >
                    Retry Payment
                  </Button>
                )}
                
                <Button
                  variant="text"
                  onClick={handleBackToCart}
                  startIcon={<ArrowBack />}
                  disabled={loading}
                  fullWidth
                >
                  Back to Cart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5">
            Order Placed Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your payment of <strong>₹{total.toFixed(2)}</strong> has been processed successfully.
          </Typography>
          {orderDetails && (
            <Chip 
              label={`Order #${orderDetails.orderNumber}`} 
              color="success" 
              sx={{ mb: 2 }}
            />
          )}
          <Typography variant="body2" color="textSecondary">
            You can track your order status in the Orders section.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
          <Button
            variant="contained"
            onClick={handleOrderComplete}
            size="large"
          >
            View Orders
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/menu')}
          >
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CheckoutPage;
