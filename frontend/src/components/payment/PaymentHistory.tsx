import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Refresh,
  AccountBalance,
  ShoppingCart,
  CheckCircle,
  Cancel,
  Pending,
  Warning,
} from '@mui/icons-material';
import { paymentService, PaymentHistoryResponse } from '../../services/paymentService';

interface PaymentHistoryProps {
  userId?: number; // For admin view
  title?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  userId,
  title = 'Payment History',
}) => {
  const [payments, setPayments] = useState<PaymentHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = userId 
        ? await paymentService.getUserPaymentHistory(userId, page, rowsPerPage)
        : await paymentService.getPaymentHistory(page, rowsPerPage);
      
      setPayments(response.content);
      setTotalCount(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, rowsPerPage, userId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'FAILED':
        return <Cancel sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'PENDING':
      case 'PROCESSING':
        return <Pending sx={{ fontSize: 16, color: 'warning.main' }} />;
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return <Warning sx={{ fontSize: 16, color: 'info.main' }} />;
      default:
        return undefined;
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'PENDING':
      case 'PROCESSING':
        return 'warning';
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FOOD_CARD_TOPUP':
        return <AccountBalance sx={{ fontSize: 16, color: 'primary.main' }} />;
      case 'ORDER_PAYMENT':
        return <ShoppingCart sx={{ fontSize: 16, color: 'secondary.main' }} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'FOOD_CARD':
        return 'Food Card';
      case 'RAZORPAY':
        return 'Razorpay';
      case 'STRIPE':
        return 'Stripe';
      case 'UPI':
        return 'UPI';
      case 'NET_BANKING':
        return 'Net Banking';
      case 'CREDIT_CARD':
        return 'Credit Card';
      case 'DEBIT_CARD':
        return 'Debit Card';
      case 'WALLET':
        return 'Digital Wallet';
      default:
        return method;
    }
  };

  if (loading && payments.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchPayments} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {payments.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No payment history found
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    {userId && <TableCell>Payment ID</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(payment.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTypeIcon(payment.paymentType)}
                          <Typography variant="body2">
                            {payment.paymentType === 'FOOD_CARD_TOPUP' ? 'Top-up' : 'Order'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.description || (payment.orderNumber ? `Order #${payment.orderNumber}` : 'N/A')}
                        </Typography>
                        {payment.vendorName && (
                          <Typography variant="caption" color="text.secondary">
                            {payment.vendorName}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatPaymentMethod(payment.paymentMethod)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          ₹{payment.amount.toFixed(2)}
                        </Typography>
                        {payment.refundAmount > 0 && (
                          <Typography variant="caption" color="info.main">
                            Refunded: ₹{payment.refundAmount.toFixed(2)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(payment.paymentStatus)}
                          label={payment.paymentStatus}
                          size="small"
                          color={getStatusColor(payment.paymentStatus)}
                          variant="outlined"
                        />
                        {payment.failureReason && (
                          <Tooltip title={payment.failureReason}>
                            <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
                              Failed
                            </Typography>
                          </Tooltip>
                        )}
                      </TableCell>
                      {userId && (
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {payment.paymentId}
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory; 