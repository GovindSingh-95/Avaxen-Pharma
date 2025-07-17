import CryptoJS from 'crypto-js'

// Generate dynamic API key for requests
export const generateApiKey = () => {
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)) // Changes every hour
  const baseString = `avaxan-pharmacy-${timestamp}`
  
  // This would match the backend generation logic
  const apiKey = CryptoJS.HmacSHA256(baseString, 'avaxan_api_key_generation_secret_2025').toString().substring(0, 32)
  return apiKey
}

// Secure request headers
export const getSecureHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': generateApiKey(),
    'X-Platform-ID': process.env.NEXT_PUBLIC_PLATFORM_ID || 'avaxan-pharmacy',
    'X-Security-Version': process.env.NEXT_PUBLIC_SECURITY_VERSION || '2.0',
    'X-Client-Version': '1.0.0'
  }

  if (includeAuth) {
    const token = localStorage.getItem('authToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

// Pharmacy compliance headers for sensitive operations
export const getPharmacyHeaders = () => {
  return {
    ...getSecureHeaders(),
    'X-Pharmacy-License': 'MH-PH-2025-AVAXAN-001',
    'X-Healthcare-Compliance': 'AVAXAN-HC-2025-INDIA'
  }
}

// Encrypt sensitive data before sending
export const encryptSensitiveData = (data: any) => {
  const key = 'avaxan_client_encryption_2025'
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
}

// Decrypt sensitive data received
export const decryptSensitiveData = (encryptedData: string) => {
  try {
    const key = 'avaxan_client_encryption_2025'
    const bytes = CryptoJS.AES.decrypt(encryptedData, key)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}

// Validate token expiry
export const isTokenValid = () => {
  const token = localStorage.getItem('authToken')
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

// Session security checks
export const validateSession = () => {
  const lastActivity = localStorage.getItem('lastActivity')
  const sessionTimeout = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '30') * 60 * 1000 // 30 minutes

  if (lastActivity && Date.now() - parseInt(lastActivity) > sessionTimeout) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('lastActivity')
    return false
  }

  localStorage.setItem('lastActivity', Date.now().toString())
  return true
}

// Generate secure request ID for tracking
export const generateRequestId = () => {
  return `avaxan_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Rate limiting check (client-side)
export const checkRateLimit = (endpoint: string, maxRequests: number = 10, windowMs: number = 60000) => {
  const key = `rateLimit_${endpoint}`
  const requests = JSON.parse(localStorage.getItem(key) || '[]')
  const now = Date.now()
  
  // Filter out old requests
  const recentRequests = requests.filter((timestamp: number) => now - timestamp < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return false
  }
  
  recentRequests.push(now)
  localStorage.setItem(key, JSON.stringify(recentRequests))
  return true
}

// Security audit logging
export const logSecurityEvent = (event: string, details: any = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionId: localStorage.getItem('sessionId') || 'anonymous'
  }
  
  console.log('[SECURITY_EVENT]', logEntry)
  
  // Store in localStorage for debugging (remove in production)
  const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]')
  logs.push(logEntry)
  
  // Keep only last 50 logs
  if (logs.length > 50) {
    logs.splice(0, logs.length - 50)
  }
  
  localStorage.setItem('securityLogs', JSON.stringify(logs))
}

export default {
  generateApiKey,
  getSecureHeaders,
  getPharmacyHeaders,
  encryptSensitiveData,
  decryptSensitiveData,
  isTokenValid,
  validateSession,
  generateRequestId,
  checkRateLimit,
  logSecurityEvent
}
