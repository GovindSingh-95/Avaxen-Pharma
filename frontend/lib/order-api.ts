import { apiClient } from './api-client';
import { Medicine } from './medicine-api';

// Types
export interface CartItem {
  medicine: Medicine;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: {
    medicine: Medicine;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'razorpay' | 'cod' | 'wallet';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  prescriptionUploaded: boolean;
  prescriptionImages: string[];
  prescriptionVerified: boolean;
  estimatedDelivery?: string;
  deliveredAt?: string;
  
  // Delivery Agent Information
  deliveryAgent?: {
    name: string;
    phone: string;
    vehicle: string;
    assignedAt?: string;
  };
  
  // Pharmacy Information
  pharmacyDetails?: {
    name: string;
    license: string;
    pharmacist: string;
    address?: string;
    phone?: string;
  };
  
  // Location Tracking
  pharmacyLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  deliveryLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated?: string;
  };
  trackingUpdates: {
    status: string;
    message: string;
    timestamp: string;
    location?: string;
  }[];
  promoCode?: string;
  promoDiscount: number;
  customerNotes?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    medicine: string;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'razorpay' | 'cod' | 'wallet';
  promoCode?: string;
  customerNotes?: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  key: string;
}

// Cart API functions
export const cartApi = {
  // Get user's cart
  getCart: async (): Promise<{ success: boolean; cart: Cart }> => {
    return apiClient.get('/api/cart');
  },

  // Add item to cart
  addToCart: async (medicineId: string, quantity: number): Promise<{ success: boolean; cart: Cart; message: string }> => {
    return apiClient.post('/api/cart/add', { medicineId, quantity });
  },

  // Update cart item quantity
  updateCartItem: async (medicineId: string, quantity: number): Promise<{ success: boolean; cart: Cart; message: string }> => {
    return apiClient.put('/api/cart/update', { medicineId, quantity });
  },

  // Remove item from cart
  removeFromCart: async (medicineId: string): Promise<{ success: boolean; cart: Cart; message: string }> => {
    return apiClient.delete(`/api/cart/remove/${medicineId}`);
  },

  // Clear entire cart
  clearCart: async (): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete('/api/cart/clear');
  },
};

// Order API functions
export const orderApi = {
  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<{ success: boolean; order: Order }> => {
    return apiClient.post('/api/orders', orderData);
  },

  // Get user's orders
  getOrders: async (page = 1, limit = 10): Promise<{ 
    success: boolean; 
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> => {
    return apiClient.get(`/api/orders?page=${page}&limit=${limit}`);
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<{ success: boolean; order: Order }> => {
    return apiClient.get(`/api/orders/${orderId}`);
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber: string): Promise<{ success: boolean; order: Order }> => {
    return apiClient.get(`/api/orders/track/${orderNumber}`);
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason: string): Promise<{ success: boolean; order: Order; message: string }> => {
    return apiClient.put(`/api/orders/${orderId}/cancel`, { reason });
  },

  // Create Razorpay order
  createRazorpayOrder: async (amount: number): Promise<{ success: boolean; order: RazorpayOrder }> => {
    return apiClient.post('/api/orders/payment/razorpay', { amount });
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }): Promise<{ success: boolean; order: Order; message: string }> => {
    return apiClient.post('/api/orders/payment/verify', paymentData);
  },

  // Upload prescription for order
  uploadPrescription: async (orderId: string, prescriptionFiles: File[]): Promise<{ 
    success: boolean; 
    order: Order; 
    message: string 
  }> => {
    const formData = new FormData();
    prescriptionFiles.forEach((file, index) => {
      formData.append(`prescription${index}`, file);
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    return apiClient.request(`/api/orders/${orderId}/prescription`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
  },
};
