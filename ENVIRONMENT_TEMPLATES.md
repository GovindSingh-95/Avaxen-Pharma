# Environment Configuration Files

## Backend (.env.example)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/avaxen_pharmacy

# JWT Secret (Generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure

# Cloudinary (Image Management) - FREE TIER
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay (Payments)
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_test_secret_key

# EmailJS (Email Notifications) - FREE
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
FROM_EMAIL=orders@avaxen.com

# AWS SNS (SMS Notifications) - FREE
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1
AWS_SNS_REGION=ap-south-1

# Hugging Face (AI/ML) - FREE
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Frontend (.env.local.example)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development

# EmailJS Configuration (FREE)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Hugging Face (FREE)
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_id
```

## Production Environment Variables

### For Backend (.env)
- Use MongoDB Atlas connection string
- Use strong JWT secret (64+ characters)
- Use live Razorpay keys after KYC
- Use production API URL
- Set NODE_ENV=production

### For Frontend (.env.local)
- Use production backend API URL
- Use live Razorpay public key
- Set NODE_ENV=production
