const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./utils/connectDB');
const { 
  generalLimiter, 
  securityHeaders, 
  corsOptions, 
  securityLogger 
} = require('./middlewares/advancedSecurity');

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '.env') });

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(securityLogger); // Log all requests for security audit
app.use(securityHeaders); // Security headers
app.use(cors(corsOptions)); // Enhanced CORS
app.use(generalLimiter); // Rate limiting
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic route with enhanced security info
app.get('/', (req, res) => {
  res.json({ 
    message: 'Avaxan Pharmacy API is running!',
    version: '2.0.0',
    security: {
      platform: 'avaxan-pharmacy',
      securityVersion: '2.0',
      encryption: 'AES-256-GCM',
      rateLimiting: 'active',
      cors: 'enhanced'
    },
    compliance: {
      pharmacyLicense: 'MH-PH-2025-AVAXAN-001',
      healthcareCompliance: 'AVAXAN-HC-2025-INDIA'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const orderRoutes = require('./routes/orders');
const prescriptionRoutes = require('./routes/prescription');
const adminMedicineRoutes = require('./routes/admin/medicines');
const deliveryRoutes = require('./routes/delivery');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/admin/medicines', adminMedicineRoutes);
app.use('/api/delivery', deliveryRoutes);

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
