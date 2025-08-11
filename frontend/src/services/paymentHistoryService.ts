// Local payment history service for storing payment transactions
export interface PaymentTransaction {
  id: string;
  type: 'TOP_UP' | 'ORDER_PAYMENT';
  amount: number;
  paymentMethod: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  description: string;
  timestamp: string;
  razorpayPaymentId?: string;
  orderId?: string;
  orderNumber?: string;
}

class PaymentHistoryService {
  private readonly STORAGE_KEY = 'payment_history';

  // Get all payment history
  getPaymentHistory(): PaymentTransaction[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading payment history:', error);
      return [];
    }
  }

  // Add new payment transaction
  addPaymentTransaction(transaction: Omit<PaymentTransaction, 'id' | 'timestamp'>): PaymentTransaction {
    const newTransaction: PaymentTransaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };

    const history = this.getPaymentHistory();
    history.unshift(newTransaction); // Add to beginning for newest first
    
    // Keep only last 100 transactions
    const trimmedHistory = history.slice(0, 100);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error saving payment history:', error);
    }

    return newTransaction;
  }

  // Get paginated payment history
  getPaymentHistoryPaginated(page: number = 0, size: number = 10) {
    const allHistory = this.getPaymentHistory();
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    return {
      content: allHistory.slice(startIndex, endIndex),
      totalElements: allHistory.length,
      totalPages: Math.ceil(allHistory.length / size),
      currentPage: page,
      size: size,
    };
  }

  // Clear all payment history
  clearPaymentHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing payment history:', error);
    }
  }

  // Add sample data for testing
  addSampleData(): void {
    const sampleTransactions: Omit<PaymentTransaction, 'id' | 'timestamp'>[] = [
      {
        type: 'TOP_UP',
        amount: 1000,
        paymentMethod: 'Razorpay',
        status: 'SUCCESS',
        description: 'Food Card Top-up',
        razorpayPaymentId: 'pay_sample123',
      },
      {
        type: 'ORDER_PAYMENT',
        amount: 250,
        paymentMethod: 'Food Card',
        status: 'SUCCESS',
        description: 'Order Payment - Lunch',
        orderId: '12345',
        orderNumber: 'ORD-001',
      },
      {
        type: 'TOP_UP',
        amount: 500,
        paymentMethod: 'Razorpay',
        status: 'FAILED',
        description: 'Food Card Top-up',
      },
    ];

    sampleTransactions.forEach(transaction => {
      this.addPaymentTransaction(transaction);
    });
  }
}

export const paymentHistoryService = new PaymentHistoryService();
export default paymentHistoryService;
