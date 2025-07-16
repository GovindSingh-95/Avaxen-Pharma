# 🔐 Razorpay Live Keys Setup Guide

## Current Status
✅ **Test Mode**: Your platform is working with Razorpay test keys  
🔄 **Next Step**: Get live keys for real payments

## Steps to Get Live Razorpay Keys

### 1. **Create Razorpay Business Account**
- Visit: https://razorpay.com
- Click "Sign Up" → "Business Account"
- Provide business email and create password

### 2. **Complete Business Verification (KYC)**

**Required Documents:**
- 📄 **Business Registration**: Certificate of Incorporation/Partnership deed
- 🆔 **PAN Card**: Business PAN card
- 🏦 **Bank Account**: Business bank account details
- 📋 **GST Certificate**: If applicable (for businesses > 20L revenue)
- 👤 **Director KYC**: Aadhaar, PAN of directors/partners

**Business Information Needed:**
- Company name and type
- Business address
- Nature of business (Pharmacy/Healthcare)
- Expected monthly volume
- Website URL

### 3. **Account Activation Process**
1. **Submit Documents** → Review (2-3 business days)
2. **Bank Verification** → Penny drop test
3. **Risk Assessment** → Internal review
4. **Account Activation** → Live keys generated

### 4. **Get Your Live Keys**
Once approved, you'll get:
```
Live Key ID: rzp_live_xxxxxxxxxxxx
Live Secret: xxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. **Update Your Application**

**Backend (.env):**
```env
# Replace with your live keys
RAZORPAY_KEY_ID=rzp_live_your_actual_live_key
RAZORPAY_KEY_SECRET=your_actual_live_secret
```

**Frontend (.env.local):**
```env
# Replace with your live key ID
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_actual_live_key
```

### 6. **Enable Webhooks (Important!)**
```javascript
// Add to your backend routes
app.post('/api/webhooks/razorpay', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  
  // Verify webhook signature
  const isValidSignature = razorpay.validateWebhookSignature(
    body, 
    signature, 
    process.env.RAZORPAY_WEBHOOK_SECRET
  );
  
  if (isValidSignature) {
    // Handle payment success/failure
    const { event, payload } = req.body;
    
    if (event === 'payment.captured') {
      // Update order status to paid
      // Send confirmation email
    }
  }
  
  res.status(200).json({ status: 'ok' });
});
```

## ⚠️ **Important Security Notes**

### **For Production:**
1. **Never expose secret keys** in frontend code
2. **Use HTTPS only** for payment pages
3. **Validate payments server-side** always
4. **Set up webhook verification**
5. **Log all payment transactions**

### **Compliance Requirements:**
- 🔒 **PCI DSS Compliance** (Razorpay handles this)
- 📝 **Privacy Policy** mentioning payment processing
- 📋 **Terms of Service** with payment terms
- 🛡️ **SSL Certificate** for your domain

## 💳 **Payment Flow Security**

```javascript
// Secure payment verification (backend only)
const verifyPayment = async (paymentId, orderId, signature) => {
  const text = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(text.toString())
    .digest("hex");
    
  return expectedSignature === signature;
};
```

## 🚀 **Timeline Expectation**
- **Document Submission**: 1 day
- **Review Process**: 2-5 business days  
- **Bank Verification**: 1-2 days
- **Final Approval**: 1-2 days
- **Total**: ~7-10 business days

## 📞 **Support**
- **Razorpay Support**: support@razorpay.com
- **Phone**: 080-68124444
- **Documentation**: https://razorpay.com/docs/

---

## 🎯 **Quick Checklist for Going Live**

- [ ] Razorpay business account created
- [ ] KYC documents submitted and verified
- [ ] Live keys received and configured
- [ ] Webhook endpoints set up
- [ ] SSL certificate installed
- [ ] Payment flow tested with small amounts
- [ ] Error handling implemented
- [ ] Transaction logging enabled
- [ ] Terms of service updated
- [ ] Privacy policy updated

**Once you have the live keys, just update your environment variables and you're ready for real payments!** 💪
