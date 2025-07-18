const User = require('../models/User')

// Admin seeding script for Avaxan Pharmacy
const createAdminAccounts = async () => {
  try {
    // Check if admin accounts already exist
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin accounts already exist')
      return
    }

    // Create admin accounts for Avaxan team
    const adminAccounts = [
      {
        name: 'Avaxan Owner',
        email: 'owner@avaxan.com',
        password: 'AvaxanOwner2025!',
        role: 'owner',
        permissions: ['all'],
        department: 'Management',
        phone: '+91 9876543210'
      },
      {
        name: 'Head Pharmacist',
        email: 'pharmacist@avaxan.com', 
        password: 'AvaxanPharmacist2025!',
        role: 'pharmacist',
        permissions: ['medicines', 'prescriptions', 'orders'],
        department: 'Pharmacy',
        phone: '+91 9876543211'
      },
      {
        name: 'Inventory Manager',
        email: 'inventory@avaxan.com',
        password: 'AvaxanInventory2025!',
        role: 'inventory',
        permissions: ['medicines', 'stock', 'suppliers'],
        department: 'Inventory',
        phone: '+91 9876543212'
      },
      {
        name: 'Customer Support',
        email: 'support@avaxan.com',
        password: 'AvaxanSupport2025!',
        role: 'support',
        permissions: ['orders', 'users', 'support'],
        department: 'Customer Service',
        phone: '+91 9876543213'
      },
      {
        name: 'Finance Manager',
        email: 'finance@avaxan.com',
        password: 'AvaxanFinance2025!',
        role: 'finance',
        permissions: ['orders', 'payments', 'reports'],
        department: 'Finance',
        phone: '+91 9876543214'
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

module.exports = { createAdminAccounts }
