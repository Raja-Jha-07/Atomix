import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../api/authApi';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { 
  setCredentials, 
  setUser, 
  logout, 
  clearError, 
  setError, 
  updateUser 
} = authSlice.actions;

export default authSlice.reducer; 