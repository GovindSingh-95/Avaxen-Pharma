import { apiClient } from './api-client';
import { Medicine } from './medicine-api';

// Admin API functions
export const adminApi = {
  // Medicine management
  medicines: {
    // Upload medicine image
    uploadImage: async (medicineId: string, imageFile: File): Promise<{
      success: boolean;
      imageUrl: string;
      message: string;
    }> => {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('medicineId', medicineId);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      return apiClient.request('/api/admin/medicines/upload-image', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });
    },

    // Bulk upload images
    bulkUploadImages: async (files: File[]): Promise<{
      success: boolean;
      message: string;
      uploadResults: any[];
      errors?: any[];
      summary: {
        total: number;
        successful: number;
        failed: number;
      };
    }> => {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      return apiClient.request('/api/admin/medicines/bulk-upload', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });
    },

    // Generate medicine image
    generateImage: async (medicineId: string, style = 'product'): Promise<{
      success: boolean;
      imageUrl: string;
      message: string;
    }> => {
      return apiClient.post('/api/admin/medicines/generate-image', {
        medicineId,
        style,
      });
    },

    // Get all medicines for admin
    getAll: async (filters: {
      search?: string;
      category?: string;
      status?: string;
      page?: number;
      limit?: number;
    } = {}): Promise<{
      success: boolean;
      medicines: Medicine[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
      };
    }> => {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const queryString = queryParams.toString();
      const endpoint = `/api/admin/medicines${queryString ? `?${queryString}` : ''}`;
      
      return apiClient.get(endpoint);
    },

    // Update medicine
    update: async (medicineId: string, data: Partial<Medicine>): Promise<{
      success: boolean;
      medicine: Medicine;
      message: string;
    }> => {
      return apiClient.put(`/api/admin/medicines/${medicineId}`, data);
    },

    // Delete medicine
    delete: async (medicineId: string): Promise<{
      success: boolean;
      message: string;
    }> => {
      return apiClient.delete(`/api/admin/medicines/${medicineId}`);
    },

    // Update medicine image URL
    updateImageUrl: async (medicineId: string, imageUrl: string): Promise<{
      success: boolean;
      medicine: Medicine;
      message: string;
    }> => {
      return apiClient.put(`/api/admin/medicines/${medicineId}/image`, {
        imageUrl,
      });
    },
  },
};
