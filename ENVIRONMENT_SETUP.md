# Environment Variables Configuration Guide

## Backend (.env)
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret_key

# Razorpay Configuration
# Test Keys (for development)
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_test_secret_key

# Live Keys (for production - replace after KYC approval)
# RAZORPAY_KEY_ID=rzp_live_your_live_key_id
# RAZORPAY_KEY_SECRET=your_live_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

## Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# For production: NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Razorpay Public Key (same as backend)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_id
# For production: NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_live_key_id

## Production Environment Variables
# When deploying to production:
# 1. Use MongoDB Atlas connection string
# 2. Use strong JWT secret (64+ characters)
# 3. Use live Razorpay keys
# 4. Use production API URL
# 5. Set NODE_ENV=production
