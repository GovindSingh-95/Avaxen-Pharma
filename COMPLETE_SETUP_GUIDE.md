# 🚀 **Complete Setup Guide - All Services**

## 📋 **Overview: What We're Setting Up**
1. **MongoDB Atlas** (Database) - FREE
2. **Cloudinary** (Image Storage) - FREE 
3. **Railway** (Backend Hosting) - FREE $5 credit
4. **Vercel** (Frontend Hosting) - FREE
5. **Connect Everything** (Integration)

---

## 🗄️ **1. MongoDB Atlas Setup (5 minutes)**

### **Step 1: Create Account**
1. Go to: **https://cloud.mongodb.com**
2. Click "Try Free" 
3. Sign up with Google/GitHub
4. Choose "I'm learning MongoDB"

### **Step 2: Create Cluster**
1. Create Organization: "Avaxen"
2. Create Project: "Avaxen-Production"
3. Build Database → **M0 FREE**
4. Cloud Provider: **AWS**
5. Region: **Mumbai (ap-south-1)** 
6. Cluster Name: **avaxen-cluster**
7. Click **Create**

### **Step 3: Security Setup**
1. **Database User:**
   - Username: `avaxenuser`
   - Password: `AvaxenPharma2025!` (save this!)
   - Database User Privileges: **Read and write to any database**

2. **Network Access:**
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - Description: "Allow all IPs for Railway"

### **Step 4: Get Connection String**
1. Click **Connect** on your cluster
2. Choose **Drivers**
3. Driver: **Node.js**
4. Copy connection string: 
   ```
   mongodb+srv://avaxenuser:<password>@avaxen-cluster.xxxxx.mongodb.net/
   ```
5. Replace `<password>` with `AvaxenPharma2025!`
6. Add database name at end: `/avaxen`

**Final Connection String:**
```
mongodb+srv://avaxenuser:AvaxenPharma2025!@avaxen-cluster.xxxxx.mongodb.net/avaxen
```

---

## 📸 **2. Cloudinary Setup (3 minutes)**

### **Step 1: Create Account**
1. Go to: **https://cloudinary.com**
2. Sign up for FREE
3. Choose "Developer" plan

### **Step 2: Get API Keys**
1. Go to **Dashboard**
2. Copy these details:
   - **Cloud Name**: `dxxxxx` (your cloud name)
   - **API Key**: `123456789012345` 
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz` (keep secret!)

### **Step 3: Configure Upload Settings**
1. Go to **Settings** → **Upload**
2. Upload presets → **Add upload preset**
3. Preset name: `avaxen_medicines`
4. Signing Mode: **Unsigned**
5. Folder: `medicines`
6. **Save**

### **Cloudinary URLs for Environment:**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here  
CLOUDINARY_API_SECRET=your_api_secret_here
CLOUDINARY_UPLOAD_PRESET=avaxen_medicines
```

---

## 🚂 **3. Railway Setup (Backend - 10 minutes)**

### **Step 1: Create Account**
1. Go to: **https://railway.app**
2. Sign up with **GitHub**
3. Connect your GitHub account

### **Step 2: Deploy Backend**
1. Click **New Project**
2. **Deploy from GitHub repo**
3. Select: `GovindSingh-95/Avaxen-Pharma`
4. **Root Directory**: `/backend`
5. Click **Deploy**

### **Step 3: Environment Variables**
1. Go to your project → **Variables** tab
2. Add these environment variables:

```bash
# Database
MONGODB_URI=mongodb+srv://avaxenuser:AvaxenPharma2025!@avaxen-cluster.xxxxx.mongodb.net/avaxen

# JWT Security
JWT_SECRET=avaxen_super_secure_jwt_key_2025_production_pharmacy_platform

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_9WdUFUmBhJWZX6
RAZORPAY_KEY_SECRET=9Nk7J8L3M4K5P6Q7R8S9T0U1V2W3X4Y5

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Server Config
NODE_ENV=production
PORT=5000

# Frontend URL (will update after Vercel setup)
FRONTEND_URL=https://your-app.vercel.app
```

### **Step 4: Get Railway URL**
1. Go to **Settings** → **Domains**
2. Your backend URL: `https://your-app-name.railway.app`
3. **Save this URL** for Vercel setup!

### **Step 5: Test Backend**
1. Visit: `https://your-app-name.railway.app`
2. Should see: "Avaxen Pharmacy API is running!"

---

## ⚡ **4. Vercel Setup (Frontend - 10 minutes)**

### **Step 1: Create Account**
1. Go to: **https://vercel.com**
2. Sign up with **GitHub**
3. Import project from GitHub

### **Step 2: Deploy Frontend**
1. Click **Add New** → **Project**
2. Import Git Repository: `GovindSingh-95/Avaxen-Pharma`
3. **Root Directory**: `frontend`
4. Framework Preset: **Next.js**
5. Click **Deploy** (will fail first - that's OK!)

### **Step 3: Environment Variables**
1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```bash
# API Connection
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app

# Razorpay (Test Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_9WdUFUmBhJWZX6

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=avaxen_medicines

# EmailJS (Optional - for notifications)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_USER_ID=user_xxxxxxx

# Hugging Face (Optional - for AI)
NEXT_PUBLIC_HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxxxx
```

### **Step 4: Redeploy**
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. Your site is now live: `https://your-app.vercel.app`

---

## 🔗 **5. Connect Frontend + Backend (5 minutes)**

### **Step 1: Update Railway with Vercel URL**
1. Go back to **Railway** → Your project → **Variables**
2. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. **Redeploy** backend

### **Step 2: Test Connection**
1. Visit your Vercel URL
2. Try to register/login
3. Browse medicines
4. Add to cart
5. Check if everything works!

---

## 🎯 **6. Seed Database (2 minutes)**

### **Step 1: Seed via Railway**
1. Go to Railway → Your project
2. Click **Connect** (terminal access)
3. Run: `npm run seed`
4. Should see: "Database seeded successfully!"

### **Alternative: Local Seed**
```bash
# In your local backend folder
cd backend
npm run seed
```

---

## ✅ **7. Final Testing Checklist**

### **Frontend (Vercel URL):**
- [ ] Homepage loads
- [ ] Medicine catalog shows
- [ ] User registration works
- [ ] Login/logout works
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Order tracking shows

### **Backend (Railway URL):**
- [ ] `/` returns API status
- [ ] `/api/medicines` returns medicine list
- [ ] `/api/auth/register` accepts new users
- [ ] Database connection working

### **Integrations:**
- [ ] Images load from Cloudinary
- [ ] Payments redirect to Razorpay
- [ ] Orders saved to MongoDB
- [ ] Frontend connects to backend

---

## 🎉 **LIVE URLS**

### **Your Live Platform:**
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.railway.app`
- **Database**: MongoDB Atlas cluster
- **Images**: Cloudinary CDN

---

## 🛠️ **How Cloudinary Works in Your App**

### **Image Upload Flow:**
1. **User uploads prescription/profile pic**
2. **Frontend sends to Cloudinary directly**
3. **Cloudinary returns secure URL**
4. **Frontend saves URL to backend**
5. **Images served via Cloudinary CDN**

### **Medicine Images:**
- **Professional stock photos** (current setup)
- **Future**: Real product photos via Cloudinary
- **Automatic optimization** (compression, WebP)
- **Fast global delivery** via CDN

### **Benefits:**
- ✅ **Free 25GB storage/month**
- ✅ **Auto image optimization**
- ✅ **Global CDN delivery**
- ✅ **Secure direct uploads**
- ✅ **Professional image transformations**

---

## 💡 **Pro Tips**

### **Cost Management:**
- All services have generous free tiers
- Railway: $5 credit lasts 1-2 months
- Upgrade only when you hit limits

### **Security:**
- Never expose API secrets in frontend
- Use environment variables everywhere
- Regularly rotate sensitive keys

### **Performance:**
- Cloudinary auto-optimizes images
- Vercel provides global CDN
- Railway has good performance in India

### **Monitoring:**
- Check Railway metrics for backend
- Monitor Vercel analytics for frontend
- Watch MongoDB Atlas usage

---

## 🚀 **You're Ready to Go Live!**

**Total Setup Time: 30-45 minutes**
**Total Cost: FREE (with usage limits)**
**Result: Professional pharmacy platform!**

**Follow this guide step by step and you'll have a live platform ready to serve customers! 🏆**
