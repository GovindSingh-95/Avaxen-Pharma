import { apiClient } from './api-client';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'pharmacist' | 'admin';
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Auth API functions
export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post('/api/auth/register', data);
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post('/api/auth/login', credentials);
  },

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; user: User }> => {
    return apiClient.get('/api/auth/profile');
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user: User }> => {
    return apiClient.put('/api/auth/profile', data);
  },

  // Add address
  addAddress: async (address: Address): Promise<{ success: boolean; user: User }> => {
    return apiClient.post('/api/auth/address', address);
  },

  // Update address
  updateAddress: async (addressId: string, address: Address): Promise<{ success: boolean; user: User }> => {
    return apiClient.put(`/api/auth/address/${addressId}`, address);
  },

  // Delete address
  deleteAddress: async (addressId: string): Promise<{ success: boolean; user: User }> => {
    return apiClient.delete(`/api/auth/address/${addressId}`);
  },

  // Logout (client-side)
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated (client-side)
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored token (client-side)
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  // Store auth data (client-side)
  storeAuthData: (user: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  // Get stored user (client-side)
  getStoredUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
