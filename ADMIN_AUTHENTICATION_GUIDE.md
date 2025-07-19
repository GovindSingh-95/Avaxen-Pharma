# 🔐 Avaxan Admin Authentication System

## Overview

The Avaxan admin system uses a secure, role-based authentication system that only allows specific admin credentials to access the admin panel.

## 🚀 Quick Setup

### 1. Create Admin Accounts

Run the admin setup script to create the default admin accounts:

```bash
cd backend
node scripts/runAdminSetup.js
```

### 2. Default Admin Credentials

After running the setup script, you'll have these admin accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Owner/Manager** | `owner@avaxan.com` | `AvaxanOwner2025!` | Full System Access |
| **Head Pharmacist** | `pharmacist@avaxan.com` | `AvaxanPharmacist2025!` | Medicines, Prescriptions, Orders |
| **Inventory Manager** | `inventory@avaxan.com` | `AvaxanInventory2025!` | Medicines, Stock, Suppliers |
| **Customer Support** | `support@avaxan.com` | `AvaxanSupport2025!` | Orders, Users, Support |
| **Finance Manager** | `finance@avaxan.com` | `AvaxanFinance2025!` | Orders, Payments, Reports |

## 🔒 Security Features

### Admin Token Security
- **Separate Admin Tokens**: Admin users get special tokens with `audience: 'avaxan-admin'`
- **24-Hour Expiry**: Admin tokens expire after 24 hours for security
- **Role Verification**: Each request verifies admin role and permissions
- **Account Status Check**: Only active admin accounts can login

### Access Control
- **Role-Based Access**: Different admin roles have different permissions
- **Route Protection**: All admin routes require valid admin tokens
- **Permission Checking**: Backend validates permissions for each action

## 📋 Admin Roles & Permissions

### Owner/Manager (`owner`)
- **Full System Access**
- Can manage all medicines, users, orders
- Can create/delete admin accounts
- Access to all admin features

### Head Pharmacist (`pharmacist`)
- **Medicines Management**
- **Prescription Review**
- **Order Processing**
- Cannot manage admin accounts

### Inventory Manager (`inventory`)
- **Medicine Stock Management**
- **Supplier Management**
- **Inventory Reports**
- Cannot access user data or orders

### Customer Support (`support`)
- **Order Management**
- **User Support**
- **Customer Data Access**
- Cannot manage medicines or inventory

### Finance Manager (`finance`)
- **Order Processing**
- **Payment Management**
- **Financial Reports**
- Cannot access user personal data

## 🛠️ API Endpoints

### Admin Authentication
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "owner@avaxan.com",
  "password": "AvaxanOwner2025!"
}
```

### Admin Token Verification
```http
GET /api/auth/admin/verify
Authorization: Bearer <admin-token>
```

### Admin Dashboard Stats
```http
GET /api/auth/admin/stats
Authorization: Bearer <admin-token>
```

## 🔧 Frontend Integration

### Admin Login Flow
1. User enters admin credentials
2. Frontend calls `/api/auth/admin/login`
3. Backend validates credentials and admin role
4. Returns admin token with 24-hour expiry
5. Frontend stores admin token in localStorage
6. Redirects to admin dashboard

### Admin Token Usage
```javascript
// Admin API calls include admin token
const response = await adminApi.auth.login(email, password);
localStorage.setItem('adminToken', response.token);

// Subsequent admin API calls use the token
const stats = await adminApi.auth.getStats();
```

## 🚨 Security Best Practices

### 1. Change Default Passwords
After first login, immediately change the default passwords:
- Use strong passwords (12+ characters)
- Include uppercase, lowercase, numbers, symbols
- Don't reuse passwords

### 2. Regular Token Rotation
- Admin tokens expire every 24 hours
- Users must re-login after token expiry
- Consider implementing refresh tokens for longer sessions

### 3. Monitor Admin Activity
- All admin logins are logged with timestamps
- Monitor for suspicious login patterns
- Implement rate limiting on admin login attempts

### 4. Secure Admin Access
- Use HTTPS in production
- Implement IP whitelisting if needed
- Consider 2FA for admin accounts

## 🔍 Troubleshooting

### Common Issues

#### "Invalid admin credentials"
- Check email and password spelling
- Ensure admin account exists in database
- Verify admin account is active

#### "Access denied. Admin privileges required"
- User account doesn't have admin role
- Admin account is deactivated
- Token has expired

#### "Admin token invalid"
- Token has expired (24-hour limit)
- Token is corrupted
- User role changed after token generation

### Debug Steps
1. Check admin account exists: `db.users.findOne({email: "owner@avaxan.com"})`
2. Verify admin role: `db.users.findOne({email: "owner@avaxan.com"}, {role: 1})`
3. Check account status: `db.users.findOne({email: "owner@avaxan.com"}, {isActive: 1})`

## 📞 Support

If you encounter issues with admin authentication:

1. **Check the logs** for detailed error messages
2. **Verify admin accounts** exist in the database
3. **Test with default credentials** first
4. **Contact system administrator** for account issues

## 🔄 Updating Admin Credentials

To change admin passwords or add new admin accounts:

1. **Update the script**: Modify `backend/scripts/createAdminAccounts.js`
2. **Run the script**: `node scripts/runAdminSetup.js`
3. **Update frontend**: Update admin accounts in `frontend/app/admin/login/page.tsx`
4. **Test login**: Verify new credentials work

---

**⚠️ Important**: Keep admin credentials secure and never share them publicly. Consider implementing additional security measures like 2FA for production environments. 