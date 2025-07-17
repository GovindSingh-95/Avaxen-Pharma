# 🏥 Avaxan Pharmacy - Admin Management Guide

## 📋 **How to Manage Your Pharmacy Database**

### 🔐 **Admin Access**
- **Website**: https://avaxan-pharma.vercel.app/admin
- **Email**: `admin@avaxan.com`
- **Password**: `admin123`

---

## 💊 **Medicine Management**

### ✅ **Adding New Medicines**
1. Go to `/admin` → Click **"Medicine Management"**
2. Click **"Add Medicine"** button
3. Fill in medicine details:
   - **Name**: e.g., "Paracetamol 500mg"
   - **Manufacturer**: e.g., "Sun Pharma"
   - **Category**: Choose from dropdown
   - **Price**: Regular price in ₹
   - **Discount Price**: Optional sale price
   - **Description**: Medicine usage and benefits
   - **Stock**: Available quantity
   - **Image URL**: Medicine photo link
   - **Prescription**: Check if requires prescription

### ✏️ **Editing Medicines**
1. Find medicine in the list
2. Click **Edit** button (pencil icon)
3. Update any fields
4. Click **"Save Changes"**

### 🗑️ **Deleting Medicines**
1. Find medicine in the list
2. Click **Delete** button (trash icon)
3. Confirm deletion

### 🔍 **Search & Filter**
- **Search**: Type medicine name or manufacturer
- **Filter**: Select category from dropdown
- **Export**: Download medicine list as CSV

---

## 📦 **Order Management**

### 📋 **View Orders**
1. Go to **"Orders"** tab in admin
2. See all customer orders with:
   - Order ID and date
   - Customer details
   - Items ordered
   - Payment status
   - Delivery status

### ✅ **Process Orders**
1. Click on order to view details
2. Update order status:
   - **Processing**: Order received
   - **Confirmed**: Payment verified
   - **Shipped**: Package sent
   - **Delivered**: Customer received
   - **Cancelled**: Order cancelled

### 📬 **Order Notifications**
- Automatic email notifications sent to customers
- SMS updates for order status changes

---

## 👥 **User Management**

### 📊 **View Users**
1. Go to **"Users"** tab
2. See all registered customers:
   - Name and contact details
   - Registration date
   - Order history
   - Account status

### 🔧 **User Actions**
- View user profile and order history
- Deactivate accounts if needed
- Handle customer support requests

---

## 📈 **Analytics & Reports**

### 📊 **Dashboard Overview**
- **Total Medicines**: Current inventory count
- **Total Orders**: All-time order count
- **Total Users**: Registered customers
- **Revenue**: Total sales amount

### 📈 **Sales Reports**
- Monthly/yearly sales trends
- Top-selling medicines
- Category performance
- Customer analytics

---

## ⚙️ **System Settings**

### 🏪 **Pharmacy Information**
1. Go to **"Settings"** tab
2. Update:
   - Pharmacy name and license
   - Contact information
   - Business address
   - Operating hours

### 💳 **Payment Settings**
- Razorpay integration status
- Payment method configuration
- Refund processing

### 📧 **Notifications**
- Email notification settings
- SMS gateway configuration
- Customer communication preferences

---

## 🛠️ **Database Operations**

### 📤 **Bulk Operations**
1. **Bulk Import**: Upload CSV file with medicine data
2. **Bulk Update**: Update multiple medicine prices/stock
3. **Export Data**: Download complete database backup

### 🔄 **Data Backup**
- Automatic daily backups to MongoDB Atlas
- Manual backup option in settings
- Restore from backup if needed

### 📋 **CSV Format for Import**
```csv
name,manufacturer,category,price,stock,prescription
"Paracetamol 500mg","Sun Pharma","Pain Relief",25,100,false
"Amoxicillin 250mg","Cipla","Antibiotics",80,50,true
```

---

## 🚨 **Important Alerts**

### ⚠️ **Low Stock Alerts**
- Automatic notifications when stock < 10 units
- Email alerts to admin
- Dashboard warnings

### 📋 **Prescription Management**
- Mark medicines that require prescription
- Verify prescription uploads from customers
- Maintain compliance records

---

## 🎯 **Daily Operations Checklist**

### 🌅 **Morning Tasks**
- [ ] Check pending orders (process within 2 hours)
- [ ] Review low stock alerts
- [ ] Verify payment notifications
- [ ] Check customer queries

### 🌆 **Evening Tasks**
- [ ] Update order statuses
- [ ] Review daily sales report
- [ ] Check inventory levels
- [ ] Plan next day restocking

---

## 📞 **Support & Help**

### 🛠️ **Technical Issues**
- **Platform Issues**: Contact development team
- **Payment Issues**: Check Razorpay dashboard
- **Database Issues**: MongoDB Atlas support

### 📚 **Training Resources**
- Admin dashboard walkthrough video
- Medicine management tutorial
- Order processing guide
- Customer service best practices

---

## 🔒 **Security & Compliance**

### 🛡️ **Data Security**
- Regular password updates
- Secure admin access only
- Customer data protection
- HIPAA compliance for prescriptions

### 📋 **Regulatory Compliance**
- Maintain pharmacy license records
- Prescription tracking and storage
- Medicine batch tracking
- Expiry date monitoring

---

**📧 Need Help?** Contact the admin support team or refer to the detailed user manual for step-by-step instructions.
