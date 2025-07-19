const express = require('express');
const { 
  register, 
  loginUser, 
  adminLogin,
  verifyAdminToken,
  getAdminStats,
  getProfile, 
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  getWishlist
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);

// Protected routes
router.get('/profile', protect, getProfile);
router.get('/admin/verify', protect, verifyAdminToken);
router.get('/admin/stats', protect, getAdminStats);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/:medicineId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;
