import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  Add,
  History,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import PaymentHistory from '../components/payment/PaymentHistory';
import FoodCardTopUp from '../components/payment/FoodCardTopUp';

const PaymentPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleTopUpSuccess = () => {
    // Trigger payment history refresh
    setRefreshHistory(prev => prev + 1);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Please log in to view payment information.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payments & Transactions
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalance />
                Quick Actions
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Add />}
                  onClick={() => setTopUpOpen(true)}
                >
                  Top Up Food Card
                </Button>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Current Balance: ₹{user.foodCardBalance?.toFixed(2) || '0.00'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12} md={8}>
          <PaymentHistory key={refreshHistory} />
        </Grid>

        {/* Additional Payment Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <History />
                Payment Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="primary">
                      Razorpay
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Credit/Debit Cards, UPI, Net Banking
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="primary">
                      Stripe
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      International Payments
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="primary">
                      Food Card
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Internal Wallet System
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="primary">
                      UPI
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Direct UPI Payments
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Payment Security:</strong> All payments are processed through secure, 
                  PCI-DSS compliant gateways. Your payment information is never stored on our servers.
                </Typography>
              </Alert>

              <Alert severity="warning" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Refund Policy:</strong> Refunds for order cancellations will be processed 
                  back to your food card balance within 24 hours. External payment refunds may take 3-7 business days.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Food Card Top-up Dialog */}
      <FoodCardTopUp
        open={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        onSuccess={handleTopUpSuccess}
        currentBalance={user.foodCardBalance || 0}
      />
    </Box>
  );
};

export default PaymentPage; 