import axios from 'axios';
import { User } from '../store/slices/authSlice';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8083/api/v1';
const USE_MOCK_AUTH = false; // Set to false when backend is ready

// Mock users for testing without backend
const mockUsers = {
  'admin@atomix.com': {
    id: '1',
    email: 'admin@atomix.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN' as const,
    floorId: '1',
    department: 'IT',
    employeeId: 'EMP001',
    phoneNumber: '+91-9876543210',
    foodCardBalance: 1000,
    isActive: true,
    emailVerified: true,
  },
  'employee@atomix.com': {
    id: '2',
    email: 'employee@atomix.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'EMPLOYEE' as const,
    floorId: '2',
    department: 'Engineering',
    employeeId: 'EMP002',
    phoneNumber: '+91-9876543211',
    foodCardBalance: 500,
    isActive: true,
    emailVerified: true,
  },
  'vendor@atomix.com': {
    id: '3',
    email: 'vendor@atomix.com',
    firstName: 'Vendor',
    lastName: 'Manager',
    role: 'VENDOR' as const,
    department: 'Food Services',
    employeeId: 'VEN001',
    phoneNumber: '+91-9876543212',
    isActive: true,
    emailVerified: true,
  },
  'manager@atomix.com': {
    id: '4',
    email: 'manager@atomix.com',
    firstName: 'Cafeteria',
    lastName: 'Manager',
    role: 'CAFETERIA_MANAGER' as const,
    floorId: '1',
    department: 'Operations',
    employeeId: 'MGR001',
    phoneNumber: '+91-9876543213',
    foodCardBalance: 2000,
    isActive: true,
    emailVerified: true,
  },
};

const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    if (USE_MOCK_AUTH) {
      // Mock authentication - accept any password for demo users
      const user = mockUsers[credentials.email as keyof typeof mockUsers];
      if (user && credentials.password.length >= 8) {
        return {
          user,
          token: `mock-jwt-token-${user.id}`,
          message: 'Login successful',
        };
      } else {
        throw new Error('Invalid credentials. Use demo emails: admin@atomix.com, employee@atomix.com, vendor@atomix.com, manager@atomix.com with any 8+ char password');
      }
    } else {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    }
  },

  register: async (userData: Omit<User, 'id'> & { password: string }) => {
    if (USE_MOCK_AUTH) {
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        isActive: true,
        emailVerified: false,
        foodCardBalance: 100,
      };
      return {
        user: newUser,
        token: `mock-jwt-token-${newUser.id}`,
        message: 'Registration successful',
      };
    } else {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    }
  },

  getCurrentUser: async () => {
    if (USE_MOCK_AUTH) {
      const token = localStorage.getItem('token');
      if (token && token.startsWith('mock-jwt-token-')) {
        const userId = token.replace('mock-jwt-token-', '');
        const user = Object.values(mockUsers).find(u => u.id === userId);
        return { user: user || mockUsers['employee@atomix.com'] };
      }
      throw new Error('Invalid token');
    } else {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
  },

  refreshToken: async () => {
    if (USE_MOCK_AUTH) {
      const token = localStorage.getItem('token');
      return { token }; // Return same mock token
    } else {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
  },
};

export { authAPI };