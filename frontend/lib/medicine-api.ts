import { apiClient } from './api-client';

// Types
export interface Medicine {
  _id: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  prescription: boolean;
  inStock: boolean;
  stockQuantity: number;
  manufacturer: string;
  description: string;
  activeIngredient: string;
  strength: string;
  form: string;
  uses: string[];
  sideEffects: string[];
  precautions: string[];
  dosage: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  prescription?: boolean;
  inStock?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface MedicinesResponse {
  success: boolean;
  medicines: Medicine[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MedicineResponse {
  success: boolean;
  medicine: Medicine;
}

export interface ScanResult {
  success: boolean;
  medicine?: Medicine;
  confidence?: number;
  message: string;
}

// Medicine API functions
export const medicineApi = {
  // Get all medicines with filters
  getMedicines: async (filters: MedicineFilters = {}): Promise<MedicinesResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/medicines${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  },

  // Get featured medicines
  getFeaturedMedicines: async (limit = 4): Promise<MedicinesResponse> => {
    return apiClient.get(`/api/medicines?featured=true&limit=${limit}`);
  },

  // Get medicine by ID
  getMedicineById: async (id: string): Promise<MedicineResponse> => {
    return apiClient.get(`/api/medicines/${id}`);
  },

  // Search medicines
  searchMedicines: async (query: string, limit = 10): Promise<MedicinesResponse> => {
    return apiClient.get(`/api/medicines?search=${encodeURIComponent(query)}&limit=${limit}`);
  },

  // Get medicine categories
  getCategories: async (): Promise<{ success: boolean; categories: string[] }> => {
    return apiClient.get('/api/medicines/categories');
  },

  // Scan medicine from image
  scanMedicine: async (imageFile: File): Promise<ScanResult> => {
    return apiClient.uploadFile('/api/medicines/scan', imageFile, 'image');
  },

  // Add to wishlist
  addToWishlist: async (medicineId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post(`/api/medicines/${medicineId}/wishlist`);
  },

  // Remove from wishlist
  removeFromWishlist: async (medicineId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/api/medicines/${medicineId}/wishlist`);
  },

  // Get user's wishlist
  getWishlist: async (): Promise<{ success: boolean; medicines: Medicine[] }> => {
    return apiClient.get('/api/medicines/wishlist');
  },
};
