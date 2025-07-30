import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CafeteriaStatus {
  id: string;
  floorId: string;
  floorName: string;
  isOpen: boolean;
  currentCapacity: number;
  maxCapacity: number;
  estimatedWaitTime: number; // in minutes
  lastUpdated: string;
  currentMenu: string[];
  announcements: string[];
}

export interface LiveStatusState {
  cafeterias: CafeteriaStatus[];
  isConnected: boolean;
  error: string | null;
}

const initialState: LiveStatusState = {
  cafeterias: [],
  isConnected: false,
  error: null,
};

const liveStatusSlice = createSlice({
  name: 'liveStatus',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updateCafeteriaStatus: (state, action: PayloadAction<CafeteriaStatus>) => {
      const index = state.cafeterias.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cafeterias[index] = action.payload;
      } else {
        state.cafeterias.push(action.payload);
      }
    },
    setCafeteriaStatuses: (state, action: PayloadAction<CafeteriaStatus[]>) => {
      state.cafeterias = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConnectionStatus,
  updateCafeteriaStatus,
  setCafeteriaStatuses,
  setError,
} = liveStatusSlice.actions;

export default liveStatusSlice.reducer; 