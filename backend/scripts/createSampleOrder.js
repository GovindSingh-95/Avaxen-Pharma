const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
require('dotenv').config();

async function createSampleOrder() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/avaxen');
    console.log('✅ Connected to MongoDB');

    // Find or create a sample user
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedpassword123',
        phone: '+91 9876543210',
        addresses: [{
          name: 'Test User',
          phone: '+91 9876543210',
          address: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        }]
      });
      await user.save();
      console.log('✅ Created sample user');
    }

    // Find some medicines
    const medicines = await Medicine.find().limit(2);
    if (medicines.length === 0) {
      console.log('❌ No medicines found. Please run seedDatabase.js first.');
      console.log('💡 Run: node seedDatabase.js');
      return;
    }

    // Check if sample order already exists
    const existingOrder = await Order.findOne({ orderNumber: 'SAMPLE123456' });
    if (existingOrder) {
      console.log('ℹ️  Sample order already exists with order number: SAMPLE123456');
      console.log('🌐 Test tracking at: http://localhost:3000/track-order?order=SAMPLE123456');
      return;
    }

    // Create sample order with proper structure
    const orderItems = medicines.slice(0, 2).map(medicine => ({
      medicine: medicine._id,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: medicine.price,
      totalPrice: medicine.price * (Math.floor(Math.random() * 3) + 1)
    }));

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const shippingFee = 50;
    const totalAmount = subtotal + tax + shippingFee;

    const sampleOrder = new Order({
      orderNumber: 'SAMPLE123456',
      user: user._id,
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      shippingFee: shippingFee,
      discount: 0,
      totalAmount: totalAmount,
      shippingAddress: {
        name: 'Test User',
        phone: '+91 9876543210',
        address: '123 Test Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      status: 'Out for Delivery',
      paymentMethod: 'cod',
      paymentStatus: 'Pending',
      prescriptionUploaded: false,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      deliveryAgent: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        vehicle: 'Bike - MH12AB1234'
      },
      pharmacyDetails: {
        name: 'HealthCare Pharmacy',
        license: 'DL-12345-2024',
        pharmacist: 'Dr. Priya Sharma'
      },
      pharmacyLocation: {
        lat: 19.0800,
        lng: 72.8750,
        address: 'HealthCare Pharmacy, Bandra West, Mumbai'
      },
      deliveryLocation: {
        lat: 19.0760,
        lng: 72.8777,
        address: '123 Test Street, Mumbai, Maharashtra 400001'
      },
      currentLocation: {
        lat: 19.0780,
        lng: 72.8765
      },
      trackingUpdates: [
        {
          status: 'Order Placed',
          message: 'Your order has been placed successfully',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          location: 'Mumbai'
        },
        {
          status: 'Order Confirmed',
          message: 'Your order has been confirmed by the pharmacy',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          location: 'HealthCare Pharmacy'
        },
        {
          status: 'Processing',
          message: 'Your medicines are being prepared',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          location: 'HealthCare Pharmacy'
        },
        {
          status: 'Packed',
          message: 'Your order has been packed and ready for pickup',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          location: 'HealthCare Pharmacy'
        },
        {
          status: 'Out for Delivery',
          message: 'Your order is out for delivery',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          location: 'En route to delivery address'
        }
      ]
    });

    await sampleOrder.save();
    console.log('✅ Sample order created successfully!');
    console.log('📦 Order Number: SAMPLE123456');
    console.log('💰 Total Amount: ₹' + totalAmount);
    console.log('📍 Status: Out for Delivery');
    console.log('🔍 Test tracking at: http://localhost:3000/track-order?order=SAMPLE123456');
    
  } catch (error) {
    console.error('❌ Error creating sample order:', error);
    if (error.name === 'ValidationError') {
      console.log('💡 This might be due to missing required fields in the Order model');
      Object.keys(error.errors).forEach(key => {
        console.log(`   - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createSampleOrder();
