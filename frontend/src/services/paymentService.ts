// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

class PaymentService {
  private razorpayKeyId: string;

  constructor() {
    this.razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_HYaOsl8oUnHAtT';
  }

  /**
   * Create order on backend and initiate Razorpay payment
   */
  async initiatePayment(options: PaymentOptions): Promise<PaymentResult> {
    try {
      // First, create order on backend
      const orderResponse = await this.createOrder(options.amount, options.currency);
      
      if (!orderResponse.success) {
        return {
          success: false,
          error: orderResponse.error || 'Failed to create order'
        };
      }

      // Initialize Razorpay payment
      return new Promise((resolve) => {
        const razorpayOptions = {
          key: this.razorpayKeyId,
          amount: orderResponse.order.amount,
          currency: orderResponse.order.currency,
          name: 'Atomix Cafeteria',
          description: options.description,
          order_id: orderResponse.order.id,
          image: '/logo192.png', // Your app logo
          prefill: {
            name: options.prefill.name,
            email: options.prefill.email,
            contact: options.prefill.contact || '',
          },
          theme: {
            color: '#1976d2', // Material UI primary color
          },
          handler: async (response: any) => {
            // Payment successful, verify on backend
            const verificationResult = await this.verifyPayment({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            resolve({
              success: verificationResult.success,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              error: verificationResult.error,
            });
          },
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                error: 'Payment cancelled by user',
              });
            },
          },
        };

        if (window.Razorpay) {
          const razorpay = new window.Razorpay(razorpayOptions);
          razorpay.open();
        } else {
          resolve({
            success: false,
            error: 'Razorpay SDK not loaded',
          });
        }
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initiation failed',
      };
    }
  }

  /**
   * Create order on backend
   */
  private async createOrder(amount: number, currency: string = 'INR') {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8083/api/v1'}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to create order',
        };
      }

      return {
        success: true,
        order: data.order,
      };
    } catch (error) {
      console.error('Create order error:', error);
      return {
        success: false,
        error: 'Network error while creating order',
      };
    }
  }

  /**
   * Verify payment on backend
   */
  private async verifyPayment(paymentData: {
    paymentId: string;
    orderId: string;
    signature: string;
  }) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8083/api/v1'}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Payment verification failed',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: 'Network error during payment verification',
      };
    }
  }

  /**
   * Recharge food card
   */
  async rechargeFoodCard(amount: number, userInfo: { name: string; email: string; contact?: string }): Promise<PaymentResult> {
    return this.initiatePayment({
      amount,
      currency: 'INR',
      description: `Food Card Recharge - ₹${amount}`,
      prefill: userInfo,
    });
  }

  /**
   * Process order payment
   */
  async payForOrder(orderTotal: number, userInfo: { name: string; email: string; contact?: string }): Promise<PaymentResult> {
    return this.initiatePayment({
      amount: orderTotal,
      currency: 'INR',
      description: `Order Payment - ₹${orderTotal}`,
      prefill: userInfo,
    });
  }
}

export const paymentService = new PaymentService();
export default paymentService; 