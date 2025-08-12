import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { AccountBalance, Add } from '@mui/icons-material';
import PaymentMethodSelector from './PaymentMethodSelector';
import RazorpayTestInfo from './RazorpayTestInfo';
import { paymentService } from '../../services/paymentService';
import { useAppDispatch } from '../../hooks/redux';
import { updateUser } from '../../store/slices/authSlice';
import { paymentHistoryService } from '../../services/paymentHistoryService';

interface FoodCardTopUpProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: number;
}

const quickAmounts = [100, 250, 500, 1000, 2000];

const FoodCardTopUp: React.FC<FoodCardTopUpProps> = ({
  open,
  onClose,
  onSuccess,
  currentBalance,
}) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'amount' | 'payment' | 'processing'>('amount');

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === '' || (Number(value) >= 0 && !isNaN(Number(value)))) {
      setAmount(value);
    }
  };

  const handleNext = () => {
    const numAmount = Number(amount);
    if (numAmount < 10) {
      setError('Minimum top-up amount is ₹10');
      return;
    }
    if (numAmount > 10000) {
      setError('Maximum top-up amount is ₹10,000');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handlePrevious = () => {
    setStep('amount');
    setError('');
  };

  const handleTopUp = async () => {
    try {
      setLoading(true);
      setError('');
      setStep('processing');

      // MOCK FOR TESTING - Remove this in production
      if (paymentMethod === 'RAZORPAY') {
        // Simulate Razorpay payment for testing
        const mockRazorpayOptions = {
          key: 'rzp_test_HYaOsl8oUnHAtT',
          amount: Number(amount) * 100,
          currency: 'INR',
          name: 'Atomix Cafeteria',
          description: `Food Card Top-up: ₹${amount}`,
          handler: (response: any) => {
            console.log('Payment Success:', response);
            // Update food card balance in Redux store
            const newBalance = currentBalance + Number(amount);
            dispatch(updateUser({ foodCardBalance: newBalance }));
            
            // Add to payment history
            paymentHistoryService.addPaymentTransaction({
              type: 'TOP_UP',
              amount: Number(amount),
              paymentMethod: 'Razorpay',
              status: 'SUCCESS',
              description: `Food Card Top-up: ₹${amount}`,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            
            onSuccess();
            handleClose();
          },
          modal: {
            ondismiss: () => {
              setError('Payment cancelled');
              setStep('payment');
              setLoading(false);
            }
          }
        };
        
        // Load and open Razorpay
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const razorpay = new (window as any).Razorpay(mockRazorpayOptions);
          razorpay.open();
        };
        document.body.appendChild(script);
        return;
      }

      const response = await paymentService.topUpFoodCard({
        amount: Number(amount),
        paymentMethod: paymentMethod as any,
      });

      if (response.paymentMethod === 'FOOD_CARD') {
        // Food card payment is processed immediately
        onSuccess();
        handleClose();
      } else if (response.paymentMethod === 'RAZORPAY') {
        // Process Razorpay payment
        await paymentService.processRazorpayPayment(
          response,
          (paymentResponse) => {
            // Payment successful
            onSuccess();
            handleClose();
          },
          (error) => {
            setError(error.message || 'Payment failed');
            setStep('payment');
          }
        );
      } else {
        // Handle other payment methods (Stripe, etc.)
        setError('Payment method not yet supported');
        setStep('payment');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to process payment');
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setPaymentMethod('RAZORPAY');
    setStep('amount');
    setError('');
    setLoading(false);
    onClose();
  };

  const renderAmountStep = () => (
    <>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Current Balance: <strong>₹{currentBalance.toFixed(2)}</strong>
          </Typography>
          <Divider />
        </Box>

        <Typography variant="h6" gutterBottom>
          Select Top-up Amount
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {quickAmounts.map((value) => (
            <Chip
              key={value}
              label={`₹${value}`}
              onClick={() => handleAmountSelect(value)}
              variant={amount === value.toString() ? 'filled' : 'outlined'}
              color={amount === value.toString() ? 'primary' : 'default'}
              clickable
            />
          ))}
        </Box>

        <TextField
          fullWidth
          label="Custom Amount"
          value={amount}
          onChange={handleAmountChange}
          type="number"
          inputProps={{ min: 10, max: 10000, step: 1 }}
          helperText="Enter amount between ₹10 and ₹10,000"
          sx={{ mb: 2 }}
        />

        {amount && (
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              New Balance: ₹{(currentBalance + Number(amount)).toFixed(2)}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={!amount || Number(amount) < 10}
          startIcon={<Add />}
        >
          Next
        </Button>
      </DialogActions>
    </>
  );

  const renderPaymentStep = () => (
    <>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">
            Top-up Amount: <strong>₹{Number(amount).toFixed(2)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New Balance: ₹{(currentBalance + Number(amount)).toFixed(2)}
          </Typography>
        </Box>

        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
          excludeMethods={['FOOD_CARD']} // Exclude food card for top-ups
          title="Choose Payment Method"
        />

        {paymentMethod === 'RAZORPAY' && (
          <Box sx={{ mt: 2 }}>
            <RazorpayTestInfo />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handlePrevious}>Back</Button>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleTopUp}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AccountBalance />}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
      </DialogActions>
    </>
  );

  const renderProcessingStep = () => (
    <>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Processing Payment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we process your payment...
          </Typography>
        </Box>
      </DialogContent>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalance />
        Top Up Food Card
      </DialogTitle>

      {step === 'amount' && renderAmountStep()}
      {step === 'payment' && renderPaymentStep()}
      {step === 'processing' && renderProcessingStep()}
    </Dialog>
  );
};

export default FoodCardTopUp; 