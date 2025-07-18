const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Pricing
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Shipping
  shippingAddress: shippingAddressSchema,
  
  // Delivery Agent
  deliveryAgent: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent' },
    name: { type: String },
    phone: { type: String },
    vehicle: {
      type: { type: String },
      number: { type: String },
      model: { type: String }
    },
    assignedAt: { type: Date },
    estimatedDelivery: { type: Date }
  },
  
  // Order status
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'wallet'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  // Prescription (if required)
  prescriptionUploaded: { type: Boolean, default: false },
  prescriptionImages: [String],
  prescriptionVerified: { type: Boolean, default: false },
  
  // Delivery
  estimatedDelivery: Date,
  deliveredAt: Date,
  
  // Pharmacy Information
  pharmacyDetails: {
    name: { type: String, default: "HealthCare Pharmacy" },
    license: String,
    pharmacist: String,
    address: String,
    phone: String
  },
  
  // Location Tracking
  pharmacyLocation: {
    lat: Number,
    lng: Number,
    address: String
  },
  deliveryLocation: {
    lat: Number,
    lng: Number,
    address: String
  },
  currentLocation: {
    lat: Number,
    lng: Number,
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Tracking
  trackingUpdates: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    location: String
  }],
  
  // Promo code
  promoCode: String,
  promoDiscount: { type: Number, default: 0 },
  
  // Notes
  customerNotes: String,
  adminNotes: String,
  
  // Cancellation
  cancelledAt: Date,
  cancellationReason: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'BRS' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
// orderNumber index is automatically created by unique: true
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
