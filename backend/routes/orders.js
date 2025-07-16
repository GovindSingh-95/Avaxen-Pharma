const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createRazorpayOrder,
  createOrder,
  getUserOrders,
  getOrderById,
  trackOrder
} = require('../controllers/orderController');

const router = express.Router();

// Cart routes
router.get('/cart', protect, getCart);
router.post('/cart/add', protect, addToCart);
router.put('/cart/update', protect, updateCartItem);
router.delete('/cart/remove/:medicineId', protect, removeFromCart);
router.delete('/cart/clear', protect, clearCart);

// Payment routes (public for now - for testing)
router.post('/payment/create-order', createRazorpayOrder);

// Public tracking route (before parameterized routes)
router.get('/track/:orderNumber', trackOrder);

// Order routes
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);

// Parameterized routes (must come last)
router.get('/:id', protect, getOrderById);

module.exports = router;
