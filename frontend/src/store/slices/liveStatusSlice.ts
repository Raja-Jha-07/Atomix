import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LiveStatusState {
  isConnected: boolean;
  activeUsers: number;
  notifications: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LiveStatusState = {
  isConnected: false,
  activeUsers: 0,
  notifications: [],
  isLoading: false,
  error: null,
};

const liveStatusSlice = createSlice({
  name: 'liveStatus',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload;
    },
    addNotification: (state, action: PayloadAction<string>) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConnected,
  setActiveUsers,
  addNotification,
  clearNotifications,
  setLoading,
  setError,
} = liveStatusSlice.actions;

export default liveStatusSlice.reducer; 