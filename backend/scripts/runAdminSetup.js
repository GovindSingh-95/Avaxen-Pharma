const { createAdminAccounts } = require('./createAdminAccounts');
const mongoose = require('mongoose');
require('dotenv').config();

const runAdminSetup = async () => {
  try {
    console.log('🚀 Starting Avaxan Admin Setup...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create admin accounts
    await createAdminAccounts();
    
    console.log('\n🎉 Admin setup completed successfully!');
    console.log('\n🔐 AUTHORIZED ADMIN CREDENTIALS:');
    console.log('=====================================');
    console.log('Email: Avaxanpharmaceuticals@gmail.com');
    console.log('Password: brijesh@28_1974');
    console.log('=====================================');
    console.log('\n⚠️  SECURITY NOTE:');
    console.log('• Only these credentials will work for admin access');
    console.log('• All other admin accounts are disabled');
    console.log('• Keep these credentials secure and confidential');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Admin setup failed:', error);
    process.exit(1);
  }
};

runAdminSetup(); 