/**
 * Development utility to clear all sample/test data
 * Run this in the browser console to clear all localStorage data
 */

// Clear all localStorage data
function clearAllData() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => localStorage.removeItem(key));
  console.log('🧹 All localStorage data cleared!');
  
  // Reload the page to start fresh
  window.location.reload();
}

// Run the function
clearAllData();
