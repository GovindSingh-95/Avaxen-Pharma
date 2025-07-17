# 🚀 **B2C Platform Deployment Guide**

## 📋 **Pre-Deployment Checklist**

### ✅ **What's Ready for Deployment**
- Complete B2C e-commerce platform
- Frontend: Next.js 15.2.4 with TypeScript
- Backend: Node.js/Express with MongoDB
- Payment: Razorpay integration (test mode)
- AI Features: Medicine scanner, prescription upload
- Real-time tracking with interactive maps
- Professional UI/UX design

### 🔧 **Quick Pre-Flight Check**
```bash
# Verify your project structure
✅ frontend/ - Next.js application
✅ backend/ - Node.js API server
✅ Environment variables properly configured
✅ .gitignore protecting sensitive files
```

---

## 🌐 **Deployment Strategy**

### **Frontend → Vercel (Recommended)**
- ✅ Free tier available
- ✅ Automatic GitHub integration
- ✅ Global CDN
- ✅ Perfect for Next.js

### **Backend → Railway (Recommended)**
- ✅ Free tier with good limits
- ✅ MongoDB hosting included
- ✅ Easy environment variables
- ✅ Auto-deploy from GitHub

---

## 🚀 **Step 1: Prepare for Deployment**

### **A. Create Production Environment Files**

1. **Create .env.example files** (safe to push to GitHub):

**Frontend .env.example:**
```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here

# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id

# Hugging Face
NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_hugging_face_key
```

**Backend .env.example:**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/avaxen

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_USER_ID=your_user_id

# Server Configuration
PORT=5000
NODE_ENV=production
```

### **B. Update package.json Scripts**

**Frontend package.json:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "npm run build && npm run start"
  }
}
```

**Backend package.json:**
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "seed": "node seedDatabase.js"
  }
}
```

---

## 🔧 **Step 2: Backend Deployment (Railway)**

### **A. Prepare Backend**
1. Ensure your `app.js` has proper port configuration:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. Add CORS configuration for your frontend domain:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### **B. Deploy to Railway**
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect GitHub** account
3. **Create new project** → Deploy from GitHub
4. **Select** your repository → Choose `backend` folder
5. **Set environment variables** in Railway dashboard:
   - MONGODB_URI
   - JWT_SECRET
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - NODE_ENV=production

6. **Deploy** → Railway will auto-build and deploy
7. **Note your backend URL**: `https://your-app-name.railway.app`

---

## 🌐 **Step 3: Frontend Deployment (Vercel)**

### **A. Prepare Frontend**
1. Update API base URL in your frontend code to use environment variable:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

### **B. Deploy to Vercel**
1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import project** from GitHub
3. **Select** your repository → Choose `frontend` folder
4. **Set environment variables** in Vercel dashboard:
   - NEXT_PUBLIC_RAZORPAY_KEY_ID
   - NEXT_PUBLIC_API_URL (your Railway backend URL)
   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - NEXT_PUBLIC_EMAILJS_SERVICE_ID
   - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
   - NEXT_PUBLIC_EMAILJS_USER_ID
   - NEXT_PUBLIC_HUGGING_FACE_API_KEY

5. **Deploy** → Vercel will auto-build and deploy
6. **Your website is live**: `https://your-app-name.vercel.app`

---

## 🔐 **Step 4: Database Setup (MongoDB Atlas)**

### **A. Create Production Database**
1. **Sign up** at [mongodb.com](https://cloud.mongodb.com)
2. **Create cluster** (free tier available)
3. **Create database user**
4. **Whitelist IP addresses** (0.0.0.0/0 for Railway)
5. **Get connection string**
6. **Update MONGODB_URI** in Railway environment variables

### **B. Seed Production Database**
```bash
# Connect to your Railway backend terminal and run:
npm run seed
```

---

## ⚡ **Step 5: Quick Deployment Commands**

### **If you want to deploy manually:**

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for production deployment"
git push origin main

# 2. Both platforms auto-deploy from GitHub
# 3. Just set environment variables in dashboards
```

---

## 🎯 **Step 6: Post-Deployment Setup**

### **A. API Verification**
1. **Razorpay**: Submit your live website URL for verification
2. **Cloudinary**: Verify domain if needed
3. **EmailJS**: Update allowed origins

### **B. Test Everything**
1. ✅ User registration/login
2. ✅ Medicine browsing
3. ✅ Cart functionality
4. ✅ Checkout process (test mode)
5. ✅ Order tracking
6. ✅ Payment gateway
7. ✅ AI medicine scanner
8. ✅ Prescription upload

---

## 📊 **Expected Costs (Free Tiers)**

### **Free Tier Limits:**
- **Vercel**: 100GB bandwidth, unlimited sites
- **Railway**: $5 credit/month (usually enough for small apps)
- **MongoDB Atlas**: 512MB storage
- **Cloudinary**: 25 credits/month
- **EmailJS**: 200 emails/month

### **When to Upgrade:**
- High traffic (>10K visits/month)
- Large file uploads
- More database storage needed

---

## 🚀 **Go Live Checklist**

```bash
✅ Backend deployed on Railway
✅ Frontend deployed on Vercel
✅ Database running on MongoDB Atlas
✅ Environment variables configured
✅ CORS properly set up
✅ All features tested
✅ Domain connected (optional)
✅ SSL certificate active (automatic)
```

---

## 🎉 **You're Live!**

**Your B2C pharmacy platform is now live and ready to serve customers!**

**Next Steps:**
1. Share your live URL with potential customers
2. Gather user feedback
3. Monitor performance
4. Plan B2B features addition

**Timeline**: 2-4 hours to complete deployment
**Cost**: Free (with limits) or $10-20/month for upgraded tiers

---

## 💡 **Pro Tips**

### **Performance:**
- Enable Vercel Analytics
- Monitor Railway resource usage
- Set up error tracking

### **Security:**
- Regular dependency updates
- Monitor API usage
- Set up backup procedures

### **Growth:**
- Plan for scaling
- Consider CDN optimization
- Prepare B2B feature roadmap

**You're about to go live with a professional pharmacy platform! 🚀**
