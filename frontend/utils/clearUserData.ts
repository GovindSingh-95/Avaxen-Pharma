// Utility function to clear all user data from localStorage
export const clearAllUserData = () => {
  try {
    // Remove all user-related data from localStorage
    localStorage.removeItem('userProfile');
    localStorage.removeItem('addresses');
    localStorage.removeItem('orders');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('cart');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any other Avaxen-related data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('avaxen_') || key.startsWith('pharmacy_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ All user data cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing user data:', error);
    return false;
  }
};

// Function to clear specific data types
export const clearUserDataType = (dataType: 'profile' | 'addresses' | 'orders' | 'wishlist' | 'cart' | 'auth') => {
  try {
    switch (dataType) {
      case 'profile':
        localStorage.removeItem('userProfile');
        break;
      case 'addresses':
        localStorage.removeItem('addresses');
        break;
      case 'orders':
        localStorage.removeItem('orders');
        break;
      case 'wishlist':
        localStorage.removeItem('wishlist');
        break;
      case 'cart':
        localStorage.removeItem('cart');
        break;
      case 'auth':
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        break;
    }
    console.log(`✅ ${dataType} data cleared successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error clearing ${dataType} data:`, error);
    return false;
  }
};
