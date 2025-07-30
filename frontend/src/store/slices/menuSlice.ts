import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS' | 'BEVERAGES';
  image?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  vendorId: string;
  vendorName: string;
  floorId?: string;
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  ingredients: string[];
  tags: string[];
  votesCount: number;
  rating: number;
}

export interface MenuState {
  items: MenuItem[];
  filteredItems: MenuItem[];
  selectedFloor: string | null;
  selectedCategory: string | null;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  filteredItems: [],
  selectedFloor: null,
  selectedCategory: null,
  searchTerm: '',
  isLoading: false,
  error: null,
};

// Async thunks would be implemented here
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (filters: { floorId?: string; category?: string }, { rejectWithValue }) => {
    try {
      // API call implementation
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu items');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSelectedFloor: (state, action: PayloadAction<string | null>) => {
      state.selectedFloor = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    filterMenuItems: (state) => {
      let filtered = state.items;

      if (state.selectedFloor) {
        filtered = filtered.filter(item => item.floorId === state.selectedFloor);
      }

      if (state.selectedCategory) {
        filtered = filtered.filter(item => item.category === state.selectedCategory);
      }

      if (state.searchTerm) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(state.searchTerm.toLowerCase()))
        );
      }

      state.filteredItems = filtered;
    },
    clearFilters: (state) => {
      state.selectedFloor = null;
      state.selectedCategory = null;
      state.searchTerm = '';
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedFloor,
  setSelectedCategory,
  setSearchTerm,
  filterMenuItems,
  clearFilters,
} = menuSlice.actions;

export default menuSlice.reducer; 