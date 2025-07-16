const express = require('express');
const { 
  registerUser, 
  loginUser, 
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
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/:medicineId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;
