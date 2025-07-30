import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  pickupTime?: string;
  orderTime: string;
  vendorId: string;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
}

export interface OrderState {
  currentOrder: OrderItem[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: [],
  orders: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<OrderItem>) => {
      const existingItem = state.currentOrder.find(item => item.menuItemId === action.payload.menuItemId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.currentOrder.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.currentOrder = state.currentOrder.filter(item => item.menuItemId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ menuItemId: string; quantity: number }>) => {
      const item = state.currentOrder.find(item => item.menuItemId === action.payload.menuItemId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.currentOrder = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = orderSlice.actions;
export default orderSlice.reducer; 