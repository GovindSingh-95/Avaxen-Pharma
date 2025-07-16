// Export all API functions and types
export * from './api-client';
export * from './auth-api';
export * from './medicine-api';
export * from './order-api';
export * from './prescription-api';
export * from './admin-api';

// Re-export commonly used items for convenience
export { apiClient, checkApiHealth } from './api-client';
export { authApi } from './auth-api';
export { medicineApi } from './medicine-api';
export { cartApi, orderApi } from './order-api';
export { prescriptionApi } from './prescription-api';
export { adminApi } from './admin-api';
