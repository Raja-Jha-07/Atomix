import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Phone,
  Wallet,
  Payment,
} from '@mui/icons-material';

export interface PaymentMethodOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  methods?: PaymentMethodOption[];
  excludeMethods?: string[];
  title?: string;
}

const defaultPaymentMethods: PaymentMethodOption[] = [
  {
    value: 'FOOD_CARD',
    label: 'Food Card',
    description: 'Use your food card balance',
    icon: <AccountBalance />,
  },
  {
    value: 'RAZORPAY',
    label: 'Razorpay',
    description: 'Credit/Debit Card, UPI, Net Banking',
    icon: <Payment />,
  },
  {
    value: 'STRIPE',
    label: 'Stripe',
    description: 'International payments',
    icon: <CreditCard />,
  },
  {
    value: 'UPI',
    label: 'UPI',
    description: 'Direct UPI payment',
    icon: <Phone />,
  },
  {
    value: 'WALLET',
    label: 'Digital Wallet',
    description: 'Paytm, PhonePe, etc.',
    icon: <Wallet />,
  },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  methods = defaultPaymentMethods,
  excludeMethods = [],
  title = 'Select Payment Method',
}) => {
  const availableMethods = methods.filter(
    (method) => !excludeMethods.includes(method.value)
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={value}
          onChange={(e) => onChange(e.target.value)}
          name="payment-method"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {availableMethods.map((method) => (
              <Card
                key={method.value}
                variant="outlined"
                sx={{
                  cursor: method.disabled ? 'not-allowed' : 'pointer',
                  opacity: method.disabled ? 0.6 : 1,
                  border: value === method.value ? '2px solid' : '1px solid',
                  borderColor: value === method.value ? 'primary.main' : 'divider',
                  '&:hover': {
                    borderColor: method.disabled ? 'divider' : 'primary.main',
                    bgcolor: method.disabled ? 'transparent' : 'action.hover',
                  },
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <FormControlLabel
                    value={method.value}
                    control={<Radio />}
                    disabled={method.disabled}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Avatar
                          sx={{
                            bgcolor: value === method.value ? 'primary.main' : 'grey.200',
                            color: value === method.value ? 'white' : 'grey.600',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {method.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {method.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{
                      margin: 0,
                      width: '100%',
                      '& .MuiFormControlLabel-label': {
                        width: '100%',
                      },
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PaymentMethodSelector; 