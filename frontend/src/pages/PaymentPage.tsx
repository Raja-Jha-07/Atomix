import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Payment,
  History,
  Add,
  CreditCard,
  Receipt,
  CheckCircle,
  Error,
  Pending,
  Refresh,
  Download,
  Info,
  TrendingUp,
  AttachMoney,
  LocalDining,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PaymentPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | string>('');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data - replace with actual API calls
  const currentBalance = user?.foodCardBalance || 0;
  const monthlySpent = 2340;
  const monthlyLimit = 5000;

  const quickRechargeAmounts = [100, 200, 500, 1000, 2000];

  const recentTransactions = [
    {
      id: 'TXN001',
      type: 'recharge',
      amount: 500,
      status: 'completed',
      date: '2025-08-03T10:30:00',
      description: 'Food Card Recharge',
      razorpayId: 'pay_abcd1234'
    },
    {
      id: 'TXN002',
      type: 'payment',
      amount: -120,
      status: 'completed',
      date: '2025-08-03T12:15:00',
      description: 'Order #ORD123 - Veg Thali',
      vendor: 'North Indian Corner'
    },
    {
      id: 'TXN003',
      type: 'payment',
      amount: -80,
      status: 'completed',
      date: '2025-08-03T13:45:00',
      description: 'Order #ORD124 - Masala Dosa',
      vendor: 'South Indian Express'
    },
    {
      id: 'TXN004',
      type: 'recharge',
      amount: 1000,
      status: 'pending',
      date: '2025-08-03T16:20:00',
      description: 'Food Card Recharge',
      razorpayId: 'pay_efgh5678'
    },
    {
      id: 'TXN005',
      type: 'payment',
      amount: -25,
      status: 'failed',
      date: '2025-08-03T14:30:00',
      description: 'Order #ORD125 - Filter Coffee',
      vendor: 'Beverages Corner',
      failureReason: 'Insufficient balance'
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'UPI',
      identifier: 'user@paytm',
      isDefault: true,
      icon: '💳'
    },
    {
      id: 2,
      type: 'Credit Card',
      identifier: '**** **** **** 1234',
      isDefault: false,
      icon: '💳'
    },
    {
      id: 3,
      type: 'Net Banking',
      identifier: 'HDFC Bank',
      isDefault: false,
      icon: '🏦'
    }
  ];

  const handleRecharge = async () => {
    setLoading(true);
    const amount = selectedAmount === 'custom' ? parseFloat(customAmount) : selectedAmount;
    
    try {
      // Here you would call your payment service
      console.log('Initiating recharge for amount:', amount);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message and close dialog
      setRechargeDialogOpen(false);
      setSelectedAmount('');
      setCustomAmount('');
      
      // Refresh balance or show success notification
    } catch (error) {
      console.error('Recharge failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'failed': return <Error />;
      default: return <Info />;
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'recharge' ? <TrendingUp color="success" /> : <LocalDining color="primary" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment & Food Card
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Manage your food card balance, payments, and transaction history
      </Typography>

      {/* Balance Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Current Balance */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="inherit" variant="overline" display="block">
                    Current Balance
                  </Typography>
                  <Typography variant="h3" component="div">
                    ₹{currentBalance.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Add />}
                    sx={{ mt: 2, color: 'primary.main' }}
                    onClick={() => setRechargeDialogOpen(true)}
                  >
                    Recharge
                  </Button>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}>
                  <AccountBalanceWallet />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Spending */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="textSecondary" variant="overline" display="block">
                  Monthly Spending
                </Typography>
                <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                  <AttachMoney />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                ₹{monthlySpent}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(monthlySpent / monthlyLimit) * 100}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="textSecondary">
                ₹{monthlyLimit - monthlySpent} remaining of ₹{monthlyLimit} limit
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                This Month
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemText primary="Transactions" secondary="23 orders" />
                  <Typography variant="body2">₹2,340</Typography>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                  <ListItemText primary="Recharges" secondary="3 times" />
                  <Typography variant="body2">₹2,000</Typography>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                  <ListItemText primary="Avg Order" secondary="Per transaction" />
                  <Typography variant="body2">₹102</Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Balance Alert */}
      {currentBalance < 100 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Low Balance Warning</AlertTitle>
          Your food card balance is running low. Consider recharging to avoid payment failures.
          <Button 
            size="small" 
            sx={{ ml: 2 }}
            onClick={() => setRechargeDialogOpen(true)}
          >
            Recharge Now
          </Button>
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="payment tabs">
          <Tab label="Transactions" icon={<History />} />
          <Tab label="Payment Methods" icon={<CreditCard />} />
          <Tab label="Receipts" icon={<Receipt />} />
        </Tabs>
      </Box>

      {/* Transactions Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Recent Transactions</Typography>
          <Button startIcon={<Refresh />} variant="outlined" size="small">
            Refresh
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getTransactionIcon(transaction.type)}
                      <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                        {transaction.type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{transaction.description}</Typography>
                    {transaction.vendor && (
                      <Typography variant="caption" color="textSecondary">
                        {transaction.vendor}
                      </Typography>
                    )}
                    {transaction.failureReason && (
                      <Typography variant="caption" color="error">
                        {transaction.failureReason}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={transaction.amount > 0 ? 'success.main' : 'text.primary'}
                      fontWeight="medium"
                    >
                      {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(transaction.status)}
                      label={transaction.status}
                      color={getStatusColor(transaction.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Download />
                    </IconButton>
                    <IconButton size="small">
                      <Info />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Payment Methods Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Saved Payment Methods</Typography>
          <Button startIcon={<Add />} variant="contained" size="small">
            Add Method
          </Button>
        </Box>

        <Grid container spacing={2}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} md={6} key={method.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h5" sx={{ mr: 2 }}>
                        {method.icon}
                      </Typography>
                      <Box>
                        <Typography variant="subtitle1">{method.type}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {method.identifier}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      {method.isDefault && (
                        <Chip label="Default" color="primary" size="small" sx={{ mb: 1, display: 'block' }} />
                      )}
                      <Button size="small">Edit</Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Receipts Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Download Receipts
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Generate and download receipts for your transactions
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Monthly Statement
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Complete transaction history for the month
                </Typography>
                <Button variant="outlined" startIcon={<Download />} fullWidth>
                  Download August 2025
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Tax Receipt
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  For expense reimbursement
                </Typography>
                <Button variant="outlined" startIcon={<Download />} fullWidth>
                  Generate Receipt
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Custom Report
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Custom date range report
                </Typography>
                <Button variant="outlined" startIcon={<Download />} fullWidth>
                  Create Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Recharge Dialog */}
      <Dialog open={rechargeDialogOpen} onClose={() => setRechargeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Recharge Food Card</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Current Balance: ₹{currentBalance.toFixed(2)}
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>
            Quick Amounts
          </Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {quickRechargeAmounts.map((amount) => (
              <Grid item xs={6} sm={4} key={amount}>
                <Button
                  variant={selectedAmount === amount ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => setSelectedAmount(amount)}
                >
                  ₹{amount}
                </Button>
              </Grid>
            ))}
          </Grid>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Or select custom amount</InputLabel>
            <Select
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
            >
              <MenuItem value="custom">Custom Amount</MenuItem>
            </Select>
          </FormControl>

          {selectedAmount === 'custom' && (
            <TextField
              fullWidth
              label="Enter Amount"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              InputProps={{ startAdornment: '₹' }}
              sx={{ mb: 3 }}
            />
          )}

          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Secure Payment</AlertTitle>
            Your payment will be processed securely through Razorpay. No card details are stored.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRechargeDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRecharge}
            disabled={!selectedAmount || loading || (selectedAmount === 'custom' && !customAmount)}
            startIcon={<Payment />}
          >
            {loading ? 'Processing...' : `Pay ₹${selectedAmount === 'custom' ? customAmount : selectedAmount}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentPage; 