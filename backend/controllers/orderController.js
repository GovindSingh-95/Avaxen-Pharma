const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Initialize Razorpay only if keys are provided
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.medicine');

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], totalItems: 0 }
      });
    }

    // Calculate totals
    let subtotal = 0;
    const validItems = cart.items.filter(item => item.medicine);
    
    validItems.forEach(item => {
      subtotal += item.medicine.price * item.quantity;
    });

    res.status(200).json({
      success: true,
      data: {
        items: validItems,
        totalItems: cart.totalItems,
        subtotal,
        tax: subtotal * 0.18, // 18% GST
        total: subtotal * 1.18
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { medicineId, quantity = 1 } = req.body;

    // Validate medicine
    const medicine = await Medicine.findById(medicineId);
    if (!medicine || !medicine.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Check stock
    if (medicine.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.medicine.toString() === medicineId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ medicine: medicineId, quantity });
    }

    await cart.save();
    await cart.populate('items.medicine');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.medicine.toString() === medicineId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.medicine');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.medicine.toString() !== medicineId
    );

    await cart.save();
    await cart.populate('items.medicine');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway not configured'
      });
    }

    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentId,
      razorpayOrderId,
      razorpaySignature,
      promoCode,
      promoDiscount = 0
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine || !medicine.isActive) {
        return res.status(404).json({
          success: false,
          message: `Medicine ${item.medicineId} not found`
        });
      }

      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}`
        });
      }

      const totalPrice = medicine.price * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        medicine: medicine._id,
        quantity: item.quantity,
        price: medicine.price,
        totalPrice
      });
    }

    const tax = subtotal * 0.18; // 18% GST
    const shippingFee = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
    const totalAmount = subtotal + tax + shippingFee - promoDiscount;

    // Verify Razorpay payment if payment method is razorpay
    if (paymentMethod === 'razorpay') {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(503).json({
          success: false,
          message: 'Payment gateway not configured'
        });
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${paymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      subtotal,
      tax,
      shippingFee,
      discount: promoDiscount,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      paymentId,
      razorpayOrderId,
      razorpaySignature,
      promoCode,
      promoDiscount,
      status: 'Confirmed',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
    });

    await order.save();

    // Update stock quantities
    for (const item of orderItems) {
      await Medicine.findByIdAndUpdate(
        item.medicine,
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] }
    );

    // Add initial tracking update
    order.trackingUpdates.push({
      status: 'Order Confirmed',
      message: 'Your order has been confirmed and is being processed',
      timestamp: new Date()
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('items.medicine')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.medicine')
      .populate('user', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
};

// Track order
const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber })
      .populate('items.medicine', 'name image batchNo expiryDate prescriptionRequired storageInstructions')
      .select('orderNumber status trackingUpdates estimatedDelivery totalAmount createdAt items deliveryAgent pharmacyDetails pharmacyLocation deliveryLocation currentLocation');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Set default pharmacy location if not set (Mumbai coordinates)
    if (!order.pharmacyLocation) {
      order.pharmacyLocation = {
        lat: 19.0800,
        lng: 72.8750,
        address: "HealthCare Pharmacy, Bandra West, Mumbai"
      };
    }

    // Set default delivery location based on shipping address
    if (!order.deliveryLocation && order.shippingAddress) {
      order.deliveryLocation = {
        lat: 19.0760,
        lng: 72.8777,
        address: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`
      };
    }

    // Set current location for active deliveries
    if (order.status === 'Out for Delivery' && !order.currentLocation) {
      order.currentLocation = {
        lat: 19.0780,
        lng: 72.8765,
        lastUpdated: new Date()
      };
    }

    // Set default delivery agent if not assigned
    if (!order.deliveryAgent && ['Shipped', 'Out for Delivery'].includes(order.status)) {
      order.deliveryAgent = {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        vehicle: "Bike - MH12AB1234",
        assignedAt: new Date()
      };
    }

    // Set default pharmacy details if not set
    if (!order.pharmacyDetails.license) {
      order.pharmacyDetails = {
        name: "HealthCare Pharmacy",
        license: "DL-12345-2024",
        pharmacist: "Dr. Priya Sharma",
        address: "Shop 15, Bandra West, Mumbai",
        phone: "+91 98765 12345"
      };
    }

    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to track order',
      error: error.message
    });
  }
};

module.exports = {
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
};
