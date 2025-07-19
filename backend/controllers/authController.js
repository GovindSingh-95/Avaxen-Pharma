const User = require('../models/User');
const Medicine = require('../models/Medicine');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// Generate enhanced JWT token with additional security
const generateEnhancedToken = (userId, email, name) => {
  const payload = {
    userId,
    email,
    name,
    platform: 'avaxan-pharmacy',
    issued: Date.now(),
    version: '2.0'
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'avaxan-pharmacy',
    audience: 'avaxan-users'
  })
}

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  )
}

const register = async (req, res) => {
  try {
    console.log('=== REGISTRATION REQUEST ===');
    console.log('Request body:', req.body);
    
    const { name, firstName, lastName, email, password, phone } = req.body;

    // Handle name field - split into firstName and lastName if provided
    let finalFirstName = firstName;
    let finalLastName = lastName;
    
    if (name && !firstName && !lastName) {
      const nameParts = name.trim().split(' ');
      finalFirstName = nameParts[0];
      finalLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    }

    console.log('Processed names:', { finalFirstName, finalLastName, email, phone });

    // Validation
    if (!finalFirstName || !email || !password || !phone) {
      console.log('Validation failed:', {
        finalFirstName: !!finalFirstName,
        email: !!email,
        password: !!password,
        phone: !!phone
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      firstName: finalFirstName,
      lastName: finalLastName,
      email,
      password,
      phone
    });

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Admin Login - Secure admin authentication - ONLY AUTHORIZED CREDENTIALS
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // STRICT CREDENTIAL CHECK - Only allow specific admin credentials
    const authorizedEmail = 'Avaxanpharmaceuticals@gmail.com';
    const authorizedPassword = 'brijesh@28_1974';

    if (email !== authorizedEmail || password !== authorizedPassword) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid admin credentials.'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check if user has admin role
    if (!['admin', 'owner', 'pharmacist', 'inventory', 'support', 'finance'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check if admin account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated. Contact system administrator.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate admin token with extended expiry
    const adminToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        platform: 'avaxan-admin',
        issued: Date.now(),
        version: '2.0'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h', // Admin tokens expire in 24 hours
        issuer: 'avaxan-pharmacy',
        audience: 'avaxan-admin'
      }
    );

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions,
        department: user.department,
        lastLogin: user.lastLogin
      },
      token: adminToken,
      isAdmin: true
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      error: error.message
    });
  }
};

// Verify admin token
const verifyAdminToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin token
    if (decoded.audience !== 'avaxan-admin') {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin token'
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !['admin', 'owner', 'pharmacist', 'inventory', 'support', 'finance'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin token valid',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions,
        department: user.department
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    // Only allow admin users
    if (!['admin', 'owner', 'pharmacist', 'inventory', 'support', 'finance'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Get basic stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMedicines = await Medicine.countDocuments();
    
    // Get low stock medicines
    const lowStockMedicines = await Medicine.find({
      $expr: {
        $lte: ['$quantity', { $ifNull: ['$minQuantity', 10] }]
      }
    }).countDocuments();

    // Get out of stock medicines
    const outOfStockMedicines = await Medicine.find({ quantity: 0 }).countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMedicines,
        lowStockMedicines,
        outOfStockMedicines,
        pendingOrders: 0, // TODO: Add order model
        totalRevenue: 0 // TODO: Add order model
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get admin stats',
      error: error.message
    });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Add Address
const addAddress = async (req, res) => {
  try {
    const { type, name, phone, address, city, state, pincode, isDefault } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // If this is set as default, make others non-default
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({
      type,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message
    });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;
    
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // If this is set as default, make others non-default
    if (updates.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    Object.assign(address, updates);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user.id);
    user.addresses.id(addressId).remove();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
};

// Toggle Wishlist
const toggleWishlist = async (req, res) => {
  try {
    const { medicineId } = req.params;
    
    const user = await User.findById(req.user.id);
    const medicine = await Medicine.findById(medicineId);
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    
    const isInWishlist = user.wishlist.includes(medicineId);
    
    if (isInWishlist) {
      user.wishlist.pull(medicineId);
    } else {
      user.wishlist.push(medicineId);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      inWishlist: !isInWishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update wishlist',
      error: error.message
    });
  }
};

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist',
      error: error.message
    });
  }
};

module.exports = {
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
};
