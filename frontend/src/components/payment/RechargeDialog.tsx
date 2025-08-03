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
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Close,
  Payment,
  CreditCard,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/redux';
import paymentService from '../../services/paymentService';

interface RechargeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const RechargeDialog: React.FC<RechargeDialogProps> = ({ open, onClose, onSuccess }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError(null);
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomAmount(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
    } else {
      setSelectedAmount(null);
    }
    setError(null);
  };

  const handleRecharge = async () => {
    if (!selectedAmount || selectedAmount <= 0) {
      setError('Please select or enter a valid amount');
      return;
    }

    if (selectedAmount < 10) {
      setError('Minimum recharge amount is ₹10');
      return;
    }

    if (selectedAmount > 50000) {
      setError('Maximum recharge amount is ₹50,000');
      return;
    }

    if (!user) {
      setError('User information not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.rechargeFoodCard(
        selectedAmount,
        {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phoneNumber,
        }
      );

      if (result.success) {
        onSuccess(selectedAmount);
        onClose();
        // Show success message
      } else {
        setError(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Recharge error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedAmount(null);
      setCustomAmount('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Recharge Food Card</Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Current Balance */}
        <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
          <CardContent>
            <Typography variant="subtitle2" color="primary.dark">
              Current Balance
            </Typography>
            <Typography variant="h4" color="primary.dark">
              ₹{user?.foodCardBalance?.toFixed(2) || '0.00'}
            </Typography>
          </CardContent>
        </Card>

        {/* Quick Amount Selection */}
        <Typography variant="subtitle1" gutterBottom>
          Select Amount
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {predefinedAmounts.map((amount) => (
            <Grid item xs={4} key={amount}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedAmount === amount ? 2 : 1,
                  borderColor: selectedAmount === amount ? 'primary.main' : 'divider',
                  bgcolor: selectedAmount === amount ? 'primary.light' : 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light',
                  },
                }}
                onClick={() => handleAmountSelect(amount)}
              >
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" color={selectedAmount === amount ? 'primary.dark' : 'text.primary'}>
                    ₹{amount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Custom Amount */}
        <Typography variant="subtitle1" gutterBottom>
          Or Enter Custom Amount
        </Typography>
        <TextField
          fullWidth
          label="Amount"
          placeholder="Enter amount in ₹"
          value={customAmount}
          onChange={handleCustomAmountChange}
          type="number"
          inputProps={{ min: 10, max: 50000 }}
          sx={{ mb: 2 }}
          disabled={loading}
        />

        {/* Amount Summary */}
        {selectedAmount && (
          <Card sx={{ mb: 2, bgcolor: 'success.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="success.dark">
                  Recharge Amount
                </Typography>
                <Typography variant="h6" color="success.dark">
                  ₹{selectedAmount.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="subtitle2" color="success.dark">
                  New Balance
                </Typography>
                <Typography variant="h6" color="success.dark">
                  ₹{((user?.foodCardBalance || 0) + selectedAmount).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Payment Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CreditCard color="action" />
          <Typography variant="body2" color="textSecondary">
            Secure payment powered by Razorpay
          </Typography>
          <Chip label="SSL Secured" size="small" color="success" variant="outlined" />
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleRecharge}
          disabled={!selectedAmount || selectedAmount <= 0 || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
          size="large"
        >
          {loading ? 'Processing...' : `Pay ₹${selectedAmount?.toFixed(2) || '0.00'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RechargeDialog; 