import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  ContentCopy,
  CreditCard,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

const RazorpayTestInfo: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const testCards = [
    {
      type: 'RuPay Success Card',
      number: '6522 0000 0000 0006',
      cvv: '123',
      expiry: '12/25',
      description: 'Indian RuPay card - Always successful',
      status: 'success',
      icon: <CheckCircle color="success" />
    },
    {
      type: 'Failure Card',
      number: '4000 0000 0000 0002',
      cvv: '123',
      expiry: '12/25',
      description: 'Test failure scenario',
      status: 'error',
      icon: <ErrorIcon color="error" />
    }
  ];

  const upiIds = [
    'success@razorpay',
    'failure@razorpay'
  ];

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light', border: '1px solid', borderColor: 'info.main' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCard color="info" />
          <Typography variant="body2" fontWeight="bold" color="info.dark">
            Razorpay Test Payment Details
          </Typography>
        </Box>
        <IconButton 
          onClick={() => setExpanded(!expanded)}
          size="small"
          sx={{ color: 'info.dark' }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Use these test credentials to simulate different payment scenarios. All payments are in test mode.
          </Alert>

          {/* Test Cards */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Credit/Debit Cards
          </Typography>
          {testCards.map((card, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {card.icon}
                <Typography variant="body2" fontWeight="bold">
                  {card.type}
                </Typography>
                <Chip 
                  label={card.status === 'success' ? 'Success' : 'Failure'} 
                  color={card.status === 'success' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                {card.description}
              </Typography>
              
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none', py: 0.5, fontWeight: 'bold' }}>Card Number:</TableCell>
                    <TableCell sx={{ border: 'none', py: 0.5, fontFamily: 'monospace' }}>
                      {card.number}
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard(card.number.replace(/\s/g, ''), `card-${index}`)}
                        sx={{ ml: 1 }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                      {copiedField === `card-${index}` && (
                        <Chip label="Copied!" size="small" color="success" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', py: 0.5, fontWeight: 'bold' }}>CVV:</TableCell>
                    <TableCell sx={{ border: 'none', py: 0.5, fontFamily: 'monospace' }}>{card.cvv}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', py: 0.5, fontWeight: 'bold' }}>Expiry:</TableCell>
                    <TableCell sx={{ border: 'none', py: 0.5, fontFamily: 'monospace' }}>{card.expiry}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          ))}

          {/* UPI Test */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            UPI IDs for Testing
          </Typography>
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
            {upiIds.map((upiId, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {upiId}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(upiId, `upi-${index}`)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
                {copiedField === `upi-${index}` && (
                  <Chip label="Copied!" size="small" color="success" />
                )}
              </Box>
            ))}
          </Paper>

          {/* Quick Test Notes */}
          <Paper sx={{ p: 2, bgcolor: 'warning.light', border: '1px solid', borderColor: 'warning.main' }}>
            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
              💡 Quick Testing Tips:
            </Typography>
            <Typography variant="caption" component="div" sx={{ mb: 1 }}>
              • Use card 4111111111111111 for successful payments
            </Typography>
            <Typography variant="caption" component="div" sx={{ mb: 1 }}>
              • Use card 4000000000000002 to test failed payments
            </Typography>
            <Typography variant="caption" component="div" sx={{ mb: 1 }}>
              • Any future expiry date and any 3-digit CVV will work
            </Typography>
            <Typography variant="caption" component="div">
              • Try different amounts to see various payment flows
            </Typography>
          </Paper>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default RazorpayTestInfo;
