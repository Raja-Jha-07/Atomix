import axios from 'axios';
import { User } from '../store/slices/authSlice';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },

  register: async (userData: Omit<User, 'id'> & { password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  refreshToken: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export { authAPI }; 