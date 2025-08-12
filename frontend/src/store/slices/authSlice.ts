import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/authService';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'EMPLOYEE' | 'VENDOR' | 'ADMIN' | 'CAFETERIA_MANAGER';
  floorId?: string;
  department?: string;
  profileImage?: string;
  employeeId?: string;
  phoneNumber?: string;
  foodCardBalance?: number;
  isActive?: boolean;
  emailVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: Omit<User, 'id'> & { password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Preserve food card balance for next login
      const currentBalance = state.user?.foodCardBalance;
      
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      
      // Store only the balance to preserve it for next login
      if (currentBalance !== undefined) {
        localStorage.setItem('preservedBalance', currentBalance.toString());
      }
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Preserve local food card balance if it exists
        const existingUser = localStorage.getItem('user');
        const preservedBalance = localStorage.getItem('preservedBalance');
        const localFoodCardBalance = existingUser 
          ? JSON.parse(existingUser).foodCardBalance 
          : (preservedBalance ? parseFloat(preservedBalance) : null);
        
        state.user = {
          ...action.payload.user,
          // Use local balance if it exists and is greater than backend balance
          foodCardBalance: localFoodCardBalance > (action.payload.user.foodCardBalance || 0)
            ? localFoodCardBalance 
            : action.payload.user.foodCardBalance
        };
        
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Save merged user data to localStorage and clear preserved balance
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.removeItem('preservedBalance');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Preserve local food card balance if it exists
        const existingUser = localStorage.getItem('user');
        const preservedBalance = localStorage.getItem('preservedBalance');
        const localFoodCardBalance = existingUser 
          ? JSON.parse(existingUser).foodCardBalance 
          : (preservedBalance ? parseFloat(preservedBalance) : null);
        
        state.user = {
          ...action.payload,
          // Use local balance if it exists and is greater than backend balance
          foodCardBalance: localFoodCardBalance > (action.payload.foodCardBalance || 0)
            ? localFoodCardBalance 
            : action.payload.foodCardBalance
        };
        
        state.isAuthenticated = true;
        
        // Save merged user data to localStorage and clear preserved balance
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.removeItem('preservedBalance');
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer; 