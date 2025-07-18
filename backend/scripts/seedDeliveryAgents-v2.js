const mongoose = require('mongoose');
const DeliveryAgent = require('../models/DeliveryAgent');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sampleAgents = [
  {
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@avaxen.com',
    vehicle: {
      type: 'Bike',
      number: 'MH-12-AB-1234',
      model: 'Honda Activa'
    },
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Andheri West, Mumbai'
    },
    status: 'available',
    rating: 4.8,
    totalDeliveries: 156
  },
  {
    name: 'Priya Sharma',
    phone: '+91 9876543211',
    email: 'priya.sharma@avaxen.com',
    vehicle: {
      type: 'Scooter',
      number: 'MH-12-CD-5678',
      model: 'TVS Jupiter'
    },
    location: {
      latitude: 19.0820,
      longitude: 72.8900,
      address: 'Bandra East, Mumbai'
    },
    status: 'available',
    rating: 4.9,
    totalDeliveries: 203
  },
  {
    name: 'Amit Patel',
    phone: '+91 9876543212',
    email: 'amit.patel@avaxen.com',
    vehicle: {
      type: 'Car',
      number: 'MH-12-EF-9012',
      model: 'Maruti Swift'
    },
    location: {
      latitude: 19.0896,
      longitude: 72.8656,
      address: 'Malad West, Mumbai'
    },
    status: 'available',
    rating: 4.7,
    totalDeliveries: 89
  },
  {
    name: 'Neha Singh',
    phone: '+91 9876543213',
    email: 'neha.singh@avaxen.com',
    vehicle: {
      type: 'Bike',
      number: 'MH-12-GH-3456',
      model: 'Bajaj Pulsar'
    },
    location: {
      latitude: 19.1136,
      longitude: 72.8697,
      address: 'Borivali West, Mumbai'
    },
    status: 'available',
    rating: 4.6,
    totalDeliveries: 127
  }
];

const seedDeliveryAgents = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MongoDB URI not found in environment variables');
      console.error('Please check your .env file contains MONGODB_URI');
      console.error('Current MONGODB_URI:', mongoUri);
      process.exit(1);
    }
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing agents
    const deleteResult = await DeliveryAgent.deleteMany({});
    console.log(`🗑️ Cleared ${deleteResult.deletedCount} existing delivery agents`);

    // Insert sample agents
    const insertResult = await DeliveryAgent.insertMany(sampleAgents);
    console.log(`✅ Created ${insertResult.length} sample delivery agents successfully!`);

    // Display the agents
    console.log('\n📋 DELIVERY AGENTS LIST:');
    console.log('========================');
    sampleAgents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name} - ${agent.phone} (${agent.vehicle.type})`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding delivery agents:', error.message);
    if (error.name === 'MongoNetworkError') {
      console.error('💡 Make sure MongoDB is running on your system');
      console.error('   For local MongoDB: Run "mongod" in another terminal');
      console.error('   For MongoDB Atlas: Check your connection string');
    }
    process.exit(1);
  }
};

seedDeliveryAgents();
