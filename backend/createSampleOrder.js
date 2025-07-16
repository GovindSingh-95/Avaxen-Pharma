const mongoose = require('mongoose');
const Order = require('./models/Order');
const Medicine = require('./models/Medicine');
const User = require('./models/User');

async function createSampleOrder() {
  try {
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/avaxen');
    console.log('Connected to MongoDB');

    // Find or create a sample user
    let user = await User.findOne({ email: 'user@example.com' });
    if (!user) {
      user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com',
        password: 'hashedpassword',
        phone: '+91 9876543210',
        addresses: [{
          name: 'John Doe',
          phone: '+91 9876543210',
          address: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        }]
      });
      await user.save();
      console.log('Created sample user');
    }

    // Find some medicines
    const medicines = await Medicine.find({}).limit(2);
    if (medicines.length === 0) {
      console.log('No medicines found in database. Please run seedDatabase.js first');
      return;
    }

    // Create sample order
    const orderNumber = 'AV' + Date.now().toString().slice(-8);
    
    const sampleOrder = new Order({
      orderNumber: orderNumber,
      user: user._id,
      items: medicines.map(medicine => ({
        medicine: medicine._id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: medicine.price,
        totalPrice: medicine.price * (Math.floor(Math.random() * 3) + 1)
      })),
      subtotal: medicines.reduce((sum, med) => sum + med.price, 0),
      tax: 15,
      shippingFee: 0,
      discount: 0,
      totalAmount: medicines.reduce((sum, med) => sum + med.price, 0) + 15,
      shippingAddress: user.addresses[0],
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
        pharmacist: 'Dr. Priya Sharma',
        address: 'Shop 15, Ground Floor, Medical Plaza, Bandra West, Mumbai - 400050',
        phone: '+91 98765 11111'
      },
      pharmacyLocation: {
        lat: 19.0800,
        lng: 72.8750,
        address: 'HealthCare Pharmacy, Bandra West, Mumbai'
      },
      deliveryLocation: {
        lat: 19.0760,
        lng: 72.8777,
        address: '123 Main Street, Mumbai, Maharashtra 400001'
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
    console.log(`Sample order created successfully!`);
    console.log(`Order Number: ${orderNumber}`);
    console.log(`Status: ${sampleOrder.status}`);
    console.log(`Total Amount: ₹${sampleOrder.totalAmount}`);
    console.log(`You can track this order at: http://localhost:3000/track-order?order=${orderNumber}`);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating sample order:', error);
    mongoose.disconnect();
  }
}

createSampleOrder();
