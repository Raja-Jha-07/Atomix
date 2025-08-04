import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:8083/api/v1';

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime?: number;
  calories?: number;
  proteinGrams?: number;
  fatGrams?: number;
  carbsGrams?: number;
  ingredients?: string[];
  tags?: string[];
  nutritionInfo?: string;
  vendorId?: number;
  vendorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItemRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  calories?: number;
  proteinGrams?: number;
  fatGrams?: number;
  carbsGrams?: number;
  ingredients?: string[];
  tags?: string[];
  nutritionInfo?: string;
}

export interface MenuItemsResponse {
  content: MenuItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/menu`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MenuItem'],
  endpoints: (builder) => ({
    // Get all menu items (public for employees)
    getAllMenuItems: builder.query<MenuItemsResponse, {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
      category?: string;
      vendorName?: string;
      available?: boolean;
    }>({
      query: (params) => ({
        url: '',
        params: {
          page: params.page || 0,
          size: params.size || 20,
          sortBy: params.sortBy || 'name',
          sortDir: params.sortDir || 'asc',
          ...(params.category && { category: params.category }),
          ...(params.vendorName && { vendorName: params.vendorName }),
          ...(params.available !== undefined && { available: params.available }),
        },
      }),
      providesTags: ['MenuItem'],
    }),

    // Get current vendor's menu items
    getMyMenuItems: builder.query<MenuItemsResponse, {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    }>({
      query: (params) => ({
        url: '/my-items',
        params: {
          page: params.page || 0,
          size: params.size || 20,
          sortBy: params.sortBy || 'name',
          sortDir: params.sortDir || 'asc',
        },
      }),
      providesTags: ['MenuItem'],
    }),

    // Create menu item
    createMenuItem: builder.mutation<MenuItem, MenuItemRequest>({
      query: (menuItem) => ({
        url: '',
        method: 'POST',
        body: menuItem,
      }),
      invalidatesTags: ['MenuItem'],
    }),

    // Update menu item
    updateMenuItem: builder.mutation<MenuItem, { id: number; menuItem: MenuItemRequest }>({
      query: ({ id, menuItem }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: menuItem,
      }),
      invalidatesTags: ['MenuItem'],
    }),

    // Delete menu item
    deleteMenuItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItem'],
    }),

    // Toggle availability
    toggleAvailability: builder.mutation<MenuItem, number>({
      query: (id) => ({
        url: `/${id}/availability`,
        method: 'PATCH',
      }),
      invalidatesTags: ['MenuItem'],
    }),

    // Get menu categories
    getMenuCategories: builder.query<string[], void>({
      query: () => '/categories',
    }),

    // Get menu item by ID
    getMenuItemById: builder.query<MenuItem, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'MenuItem', id }],
    }),
  }),
});

export const {
  useGetAllMenuItemsQuery,
  useGetMyMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useToggleAvailabilityMutation,
  useGetMenuCategoriesQuery,
  useGetMenuItemByIdQuery,
} = menuApi;

// Traditional service functions for non-RTK Query usage
export const menuService = {
  async getAllMenuItems(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    category?: string;
    vendorName?: string;
    available?: boolean;
  } = {}): Promise<MenuItemsResponse> {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/menu?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch menu items');
    }

    return response.json();
  },

  async getMyMenuItems(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}): Promise<MenuItemsResponse> {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/menu/my-items?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendor menu items');
    }

    return response.json();
  },

  async createMenuItem(menuItem: MenuItemRequest): Promise<MenuItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      throw new Error('Failed to create menu item');
    }

    return response.json();
  },

  async updateMenuItem(id: number, menuItem: MenuItemRequest): Promise<MenuItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      throw new Error('Failed to update menu item');
    }

    return response.json();
  },

  async deleteMenuItem(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete menu item');
    }
  },

  async toggleAvailability(id: number): Promise<MenuItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/menu/${id}/availability`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to toggle availability');
    }

    return response.json();
  },

  async getMenuCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/menu/categories`);

    if (!response.ok) {
      throw new Error('Failed to fetch menu categories');
    }

    return response.json();
  },

  async getMenuItemById(id: number): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch menu item');
    }

    return response.json();
  },
};
