import axios from 'axios';

const API_BASE_URL = '';

// Payment interfaces matching backend DTOs
export interface PaymentMethod {
  FOOD_CARD: 'FOOD_CARD';
  CREDIT_CARD: 'CREDIT_CARD';
  DEBIT_CARD: 'DEBIT_CARD';
  UPI: 'UPI';
  NET_BANKING: 'NET_BANKING';
  WALLET: 'WALLET';
  CASH: 'CASH';
  RAZORPAY: 'RAZORPAY';
  STRIPE: 'STRIPE';
}

export interface PaymentType {
  ORDER_PAYMENT: 'ORDER_PAYMENT';
  FOOD_CARD_TOPUP: 'FOOD_CARD_TOPUP';
}

export interface PaymentStatus {
  CREATED: 'CREATED';
  PENDING: 'PENDING';
  COMPLETED: 'COMPLETED';
  FAILED: 'FAILED';
  CANCELLED: 'CANCELLED';
}

export interface PaymentRequest {
  amount: number;
  paymentMethod: keyof PaymentMethod;
  paymentType: keyof PaymentType;
  orderId?: number;
  description?: string;
}

export interface PaymentResponse {
  paymentId: string;
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  amount: number;
  paymentMethod: keyof PaymentMethod;
  paymentStatus: keyof PaymentStatus;
  paymentType: keyof PaymentType;
  currency: string;
  description?: string;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
  
  // Gateway specific fields
  razorpayKeyId?: string;
  stripePublicKey?: string;
  clientSecret?: string;
}

export interface PaymentVerificationRequest {
  paymentId: string;
  gatewayPaymentId: string;
  gatewayOrderId: string;
  gatewaySignature?: string;
}

export interface PaymentHistoryResponse {
  id: number;
  paymentId: string;
  amount: number;
  paymentMethod: keyof PaymentMethod;
  paymentStatus: keyof PaymentStatus;
  paymentType: keyof PaymentType;
  description?: string;
  failureReason?: string;
  refundAmount: number;
  createdAt: string;
  processedAt?: string;
  failedAt?: string;
  orderNumber?: string;
  vendorName?: string;
}

export interface FoodCardTopUpRequest {
  amount: number;
  paymentMethod: keyof PaymentMethod;
}

export interface FoodCardBalanceResponse {
  userId: number;
  balance: number;
  lastUpdated: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

class PaymentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Create payment order
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/payments/create`,
      request,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Verify payment
  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/payments/verify`,
      request,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Get payment details
  async getPayment(paymentId: string): Promise<PaymentResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/payments/${paymentId}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Get payment history
  async getPaymentHistory(page = 0, size = 10): Promise<PageResponse<PaymentHistoryResponse>> {
    const response = await axios.get(
      `${API_BASE_URL}/payments/history?page=${page}&size=${size}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Get user payment history (admin/manager)
  async getUserPaymentHistory(userId: number, page = 0, size = 10): Promise<PageResponse<PaymentHistoryResponse>> {
    const response = await axios.get(
      `${API_BASE_URL}/payments/history/${userId}?page=${page}&size=${size}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Top up food card
  async topUpFoodCard(request: FoodCardTopUpRequest): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/payments/topup`,
      request,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Get food card balance
  async getFoodCardBalance(): Promise<FoodCardBalanceResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/payments/foodcard/balance`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Get user food card balance (admin/manager)
  async getUserFoodCardBalance(userId: number): Promise<FoodCardBalanceResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/payments/foodcard/balance/${userId}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  // Load Razorpay script
  async loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Process Razorpay payment
  async processRazorpayPayment(
    paymentResponse: PaymentResponse,
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
  ) {
    const isLoaded = await this.loadRazorpayScript();
    if (!isLoaded) {
      onFailure(new Error('Failed to load Razorpay SDK'));
      return;
    }

    const options = {
      key: paymentResponse.razorpayKeyId,
      amount: paymentResponse.amount * 100, // Convert to paise
      currency: paymentResponse.currency,
      name: 'Atomix Cafeteria',
      description: paymentResponse.description || 'Payment',
      order_id: paymentResponse.gatewayOrderId,
      handler: async (response: any) => {
        try {
          // Verify payment on backend
          const verificationRequest: PaymentVerificationRequest = {
            paymentId: paymentResponse.paymentId,
            gatewayPaymentId: response.razorpay_payment_id,
            gatewayOrderId: response.razorpay_order_id,
            gatewaySignature: response.razorpay_signature
          };
          
          const verifiedPayment = await this.verifyPayment(verificationRequest);
          onSuccess(verifiedPayment);
        } catch (error) {
          onFailure(error);
        }
      },
      modal: {
        ondismiss: () => {
          onFailure(new Error('Payment cancelled by user'));
        }
      },
      theme: {
        color: '#1976d2'
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  }
}

export const paymentService = new PaymentService();
