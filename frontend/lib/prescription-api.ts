import { apiClient } from './api-client';

// Types
export interface Prescription {
  _id: string;
  user: string;
  images: string[];
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  pharmacistNotes?: string;
  medicines?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadPrescriptionResponse {
  success: boolean;
  prescription: Prescription;
  message: string;
}

// Prescription API functions
export const prescriptionApi = {
  // Upload prescription
  uploadPrescription: async (prescriptionFiles: File[]): Promise<UploadPrescriptionResponse> => {
    const formData = new FormData();
    prescriptionFiles.forEach((file) => {
      formData.append('images', file);
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    return apiClient.request('/api/prescription/upload', {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
  },

  // Get user's prescriptions
  getPrescriptions: async (page = 1, limit = 10): Promise<{
    success: boolean;
    prescriptions: Prescription[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> => {
    return apiClient.get(`/api/prescription?page=${page}&limit=${limit}`);
  },

  // Get prescription by ID
  getPrescriptionById: async (prescriptionId: string): Promise<{
    success: boolean;
    prescription: Prescription;
  }> => {
    return apiClient.get(`/api/prescription/${prescriptionId}`);
  },

  // Delete prescription
  deletePrescription: async (prescriptionId: string): Promise<{
    success: boolean;
    message: string;
  }> => {
    return apiClient.delete(`/api/prescription/${prescriptionId}`);
  },
};
