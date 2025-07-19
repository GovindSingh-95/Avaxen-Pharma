const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

// General API rate limiting
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
)

// Auth specific rate limiting
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts from this IP, please try again later.'
)

// Strict rate limiting for sensitive operations
const strictLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // limit each IP to 10 requests per windowMs
  'Too many requests for this operation, please try again later.'
)

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"],
    },
  },
  crossOriginEmbedderPolicy: false,
})

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://avaxan-pharma.vercel.app',
      'https://avaxan-pharma-hg0otc0mw-govinds9551-gmailcoms-projects.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005'
    ]
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // For development, allow any localhost origin
    if (process.env.NODE_ENV === 'development' && origin && origin.startsWith('http://localhost:')) {
      return callback(null, true)
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With'],
}

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }
  
  // Generate expected API key based on timestamp and secret
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)) // Change every hour
  const expectedKey = crypto
    .createHmac('sha256', process.env.API_KEY_SECRET)
    .update(`avaxan-pharmacy-${timestamp}`)
    .digest('hex')
    .substring(0, 32)
  
  if (apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Invalid API key' })
  }
  
  next()
}

// Enhanced JWT token validation
const validateEnhancedToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Additional security checks
    if (!decoded.userId || !decoded.email) {
      return res.status(401).json({ error: 'Invalid token format' })
    }
    
    // Check if token is issued for Avaxan platform
    if (decoded.platform !== 'avaxan-pharmacy') {
      return res.status(401).json({ error: 'Token not valid for this platform' })
    }
    
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Data encryption utilities
const encryptSensitiveData = (data) => {
  const algorithm = 'aes-256-gcm'
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32)
  const iv = crypto.randomBytes(16)
  
  const cipher = crypto.createCipher(algorithm, key)
  cipher.setAAD(Buffer.from('avaxan-pharmacy', 'utf8'))
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

const decryptSensitiveData = (encryptedData) => {
  const algorithm = 'aes-256-gcm'
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32)
  
  const decipher = crypto.createDecipher(algorithm, key)
  decipher.setAAD(Buffer.from('avaxan-pharmacy', 'utf8'))
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return JSON.parse(decrypted)
}

// Pharmacy compliance middleware
const validatePharmacyCompliance = (req, res, next) => {
  const licenseKey = req.headers['x-pharmacy-license']
  
  if (licenseKey !== process.env.PHARMACY_LICENSE_KEY) {
    return res.status(403).json({ 
      error: 'Invalid pharmacy license',
      code: 'PHARMACY_LICENSE_REQUIRED'
    })
  }
  
  next()
}

// Request logging for security audit
const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  const ip = req.ip || req.connection.remoteAddress
  const userAgent = req.get('User-Agent')
  
  console.log(`[SECURITY] ${timestamp} | ${ip} | ${req.method} ${req.path} | ${userAgent}`)
  
  // Log sensitive operations
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    console.log(`[SENSITIVE_OP] ${timestamp} | ${ip} | ${req.method} ${req.path}`)
  }
  
  next()
}

module.exports = {
  generalLimiter,
  authLimiter,
  strictLimiter,
  securityHeaders,
  corsOptions,
  validateApiKey,
  validateEnhancedToken,
  encryptSensitiveData,
  decryptSensitiveData,
  validatePharmacyCompliance,
  securityLogger
}
