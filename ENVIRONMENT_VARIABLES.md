# 🔧 **Environment Variables Quick Reference**

## 🚂 **RAILWAY (Backend) Environment Variables**

```bash
# Copy-paste these into Railway → Variables tab

# Database (YOUR ACTUAL MONGODB CONNECTION)
MONGODB_URI=mongodb+srv://Govind:xc9zjrR4bEKduGZE@cluster0.sdviw97.mongodb.net/avaxen?retryWrites=true&w=majority&appName=Cluster0

# Security
JWT_SECRET=avaxen_super_secure_jwt_key_2025_production_pharmacy_platform
NODE_ENV=production

# Payments (Test Mode)
RAZORPAY_KEY_ID=rzp_test_9WdUFUmBhJWZX6
RAZORPAY_KEY_SECRET=9Nk7J8L3M4K5P6Q7R8S9T0U1V2W3X4Y5

# Images
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

# CORS
FRONTEND_URL=https://your-app.vercel.app
```

---

## ⚡ **VERCEL (Frontend) Environment Variables**

```bash
# Copy-paste these into Vercel → Settings → Environment Variables

# Backend Connection
NEXT_PUBLIC_API_URL=https://your-app.railway.app

# Payments
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_9WdUFUmBhJWZX6

# Images
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=avaxen_medicines

# Optional: Notifications
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_USER_ID=user_xxxxxxx

# Optional: AI Features
NEXT_PUBLIC_HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxxxx
```

---

## 📸 **Cloudinary Setup Values**

### **What you get from Cloudinary Dashboard:**
```bash
Cloud Name: dxxxxx          # Use this in CLOUDINARY_CLOUD_NAME
API Key: 123456789012345    # Use this in CLOUDINARY_API_KEY  
API Secret: abcdefghijk... # Use this in CLOUDINARY_API_SECRET
```

### **Upload Preset (Create this):**
```bash
Preset Name: avaxen_medicines
Signing Mode: Unsigned
Folder: medicines
Access Mode: Public
```

---

## 🗄️ **MongoDB Connection String Format**

### **Template:**
```
mongodb+srv://<username>:<password>@<cluster-name>.xxxxx.mongodb.net/<database-name>
```

### **Your Actual String:**
```
mongodb+srv://avaxenuser:AvaxenPharma2025!@avaxen-cluster.xxxxx.mongodb.net/avaxen
```

**Replace `xxxxx` with your actual cluster ID from MongoDB Atlas!**

---

## 🔄 **Setup Order (Important!)**

### **1. MongoDB Atlas** 
→ Get connection string

### **2. Cloudinary**
→ Get cloud name, API key, secret

### **3. Railway (Backend)**
→ Deploy with environment variables
→ Get Railway URL

### **4. Vercel (Frontend)**  
→ Deploy with environment variables
→ Use Railway URL in NEXT_PUBLIC_API_URL

### **5. Update Railway**
→ Set FRONTEND_URL to Vercel URL

---

## ⚠️ **Common Mistakes to Avoid**

### **❌ Don't:**
- Use `http://` in production URLs (use `https://`)
- Forget the database name in MongoDB URI
- Mix up Railway/Vercel environment variables
- Expose secrets in frontend code

### **✅ Do:**
- Double-check all URLs have `https://`
- Test each service individually
- Save all credentials securely  
- Redeploy after changing environment variables

---

## 🚀 **Quick Test Commands**

### **Test MongoDB Connection:**
```bash
# In Railway terminal or local
node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('✅ DB Connected')).catch(e => console.log('❌ DB Error:', e.message))"
```

### **Test Backend API:**
```bash
curl https://your-app.railway.app/
# Should return: {"message": "Avaxen Pharmacy API is running!"}
```

### **Test Frontend:**
```bash
# Visit: https://your-app.vercel.app
# Should load homepage with medicines
```

---

## 💡 **How Cloudinary Integration Works**

### **In Your App:**
1. **User uploads image** (prescription, profile pic)
2. **Frontend uploads directly to Cloudinary**
3. **Cloudinary returns secure URL**
4. **Frontend saves URL to backend database**
5. **Images display from Cloudinary CDN**

### **Benefits:**
- ✅ **Fast global delivery**
- ✅ **Automatic optimization** 
- ✅ **Free 25GB/month**
- ✅ **Professional transformations**
- ✅ **Secure direct uploads**

### **Current Usage:**
- Medicine catalog images (stock photos)
- User prescription uploads
- Profile pictures
- Future: Real product photos

---

## 🎯 **Ready to Deploy?**

**Follow the `COMPLETE_SETUP_GUIDE.md` with these environment variables and you'll be live in 30 minutes!** 🚀
