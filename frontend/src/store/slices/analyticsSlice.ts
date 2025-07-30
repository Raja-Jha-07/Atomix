import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FloorAnalytics {
  floorId: string;
  floorName: string;
  peopleCount: number;
  timestamp: string;
}

export interface SalesAnalytics {
  date: string;
  revenue: number;
  orderCount: number;
  popularItems: { itemId: string; itemName: string; orderCount: number }[];
}

export interface AnalyticsState {
  floorData: FloorAnalytics[];
  salesData: SalesAnalytics[];
  rushHours: { hour: number; count: number }[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  floorData: [],
  salesData: [],
  rushHours: [],
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateFloorData: (state, action: PayloadAction<FloorAnalytics[]>) => {
      state.floorData = action.payload;
    },
    updateSalesData: (state, action: PayloadAction<SalesAnalytics[]>) => {
      state.salesData = action.payload;
    },
    updateRushHours: (state, action: PayloadAction<{ hour: number; count: number }[]>) => {
      state.rushHours = action.payload;
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
  updateFloorData,
  updateSalesData,
  updateRushHours,
  setLoading,
  setError,
} = analyticsSlice.actions;

export default analyticsSlice.reducer; 