import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083/api/v1';

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  vendor: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'FOOD_CARD' | 'RAZORPAY';
  paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  specialInstructions?: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

class OrderService {
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders() {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<{ success: boolean; order?: OrderResponse; error?: string }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
          },
        }
      );

      return {
        success: true,
        order: response.data,
      };
    } catch (error: any) {
      console.error('Create order error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create order',
      };
    }
  }

  /**
   * Get user's orders
   */
  async getUserOrders(): Promise<{ success: boolean; orders?: OrderResponse[]; error?: string }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/my-orders`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: true,
        orders: response.data,
      };
    } catch (error: any) {
      console.error('Get user orders error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch orders',
      };
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: number): Promise<{ success: boolean; order?: OrderResponse; error?: string }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/${orderId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return {
        success: true,
        order: response.data,
      };
    } catch (error: any) {
      console.error('Get order by ID error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch order',
      };
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: number, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await axios.put(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        { reason },
        {
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
          },
        }
      );

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel order',
      };
    }
  }

  /**
   * Update food card balance after payment
   */
  async updateFoodCardBalance(amount: number): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/update-balance`,
        { amount: -amount }, // Negative amount for deduction
        {
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
          },
        }
      );

      return {
        success: true,
        newBalance: response.data.newBalance,
      };
    } catch (error: any) {
      console.error('Update food card balance error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update balance',
      };
    }
  }
}

const orderService = new OrderService();
export default orderService; 