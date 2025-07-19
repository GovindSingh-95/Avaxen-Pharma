require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const User = require('../models/User')
const mongoose = require('mongoose');

// Admin seeding script for Avaxan Pharmacy
const createAdminAccounts = async () => {
  try {
    // Check if admin accounts already exist
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin accounts already exist')
      return
    }

    // Create admin account for Avaxan - ONLY ONE AUTHORIZED ADMIN
    const adminAccounts = [
      {
        name: 'Avaxan Pharmaceuticals Admin',
        email: 'Avaxanpharmaceuticals@gmail.com',
        password: 'brijesh@28_1974',
        role: 'admin',
        permissions: ['manage_medicines', 'manage_orders', 'manage_users', 'view_analytics'],
        department: 'Administration',
        phone: '+91 9876543210'
      }
    ]

    for (const admin of adminAccounts) {
      const newAdmin = await User.create({
        ...admin,
        isActive: true,
        lastLogin: new Date(),
        createdBy: 'system',
        securityLevel: 'high'
      })
      
      console.log(`✅ Created admin account: ${admin.email}`)
    }

    console.log('🎉 All Avaxan admin accounts created successfully!')
    
    // Print login credentials for the team
    console.log('\n🔐 AVAXAN ADMIN LOGIN CREDENTIALS:')
    console.log('=====================================')
    adminAccounts.forEach(admin => {
      console.log(`${admin.department}: ${admin.email} / ${admin.password}`)
    })
    console.log('=====================================')
    console.log('🌐 Admin Dashboard: https://avaxan-pharma.vercel.app/admin')
    
  } catch (error) {
    console.error('❌ Error creating admin accounts:', error)
  }
}

console.log("Connecting to:", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB!');
    createAdminAccounts();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

