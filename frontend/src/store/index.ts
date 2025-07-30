import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import menuSlice from './slices/menuSlice';
import orderSlice from './slices/orderSlice';
import liveStatusSlice from './slices/liveStatusSlice';
import analyticsSlice from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    menu: menuSlice,
    order: orderSlice,
    liveStatus: liveStatusSlice,
    analytics: analyticsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 