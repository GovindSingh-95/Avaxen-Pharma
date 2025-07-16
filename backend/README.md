# Avaxen Pharmacy Backend API

A comprehensive backend API for the Avaxen online pharmacy platform built with Node.js, Express, and MongoDB.

## Features

### 🔐 Authentication & User Management
- User registration and login with JWT tokens
- Role-based access control (User, Pharmacist, Admin)
- Profile management with multiple addresses
- Wishlist functionality

### 💊 Medicine Management
- Comprehensive medicine catalog with search and filtering
- Category-based browsing
- Featured medicines
- Medicine details with usage, side effects, and precautions
- Stock management

### 🛒 E-commerce Features
- Shopping cart functionality
- Order management with status tracking
- Razorpay payment integration
- Promo code support
- Order history and tracking

### 🔬 Healthcare Features
- **Medicine Scanner**: AI-powered medicine identification from images
- **Prescription Upload**: Upload and pharmacist review system
- **Health Analytics**: Usage tracking and insights

### 📱 Additional Features
- Image upload with Cloudinary integration
- Real-time order tracking
- Email notifications
- Error handling and logging

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Payment**: Razorpay
- **Image Processing**: Multer + Cloudinary

## API Endpoints

### Authentication
```
POST /api/auth/register          # Register new user
POST /api/auth/login             # User login
GET  /api/auth/profile           # Get user profile
PUT  /api/auth/profile           # Update profile
POST /api/auth/address           # Add address
PUT  /api/auth/address/:id       # Update address
DEL  /api/auth/address/:id       # Delete address
POST /api/auth/wishlist/:id      # Toggle wishlist
GET  /api/auth/wishlist          # Get wishlist
```

### Medicines
```
GET  /api/medicines              # Get all medicines (with filters)
GET  /api/medicines/:id          # Get medicine by ID
GET  /api/medicines/featured     # Get featured medicines
GET  /api/medicines/categories   # Get all categories
GET  /api/medicines/search       # Search medicines
POST /api/medicines/scan         # Medicine scanner (upload image)
GET  /api/medicines/scan/:id/result # Get scan result
```

### Orders & Cart
```
GET  /api/orders/cart            # Get user's cart
POST /api/orders/cart/add        # Add item to cart
PUT  /api/orders/cart/update     # Update cart item
DEL  /api/orders/cart/remove/:id # Remove from cart
DEL  /api/orders/cart/clear      # Clear cart

POST /api/orders/payment/create-order # Create Razorpay order
POST /api/orders                 # Create order
GET  /api/orders                 # Get user orders
GET  /api/orders/:id             # Get order by ID
GET  /api/orders/track/:orderNumber # Track order (public)
```

### Prescriptions
```
POST /api/prescription/upload    # Upload prescription
GET  /api/prescription           # Get user prescriptions
GET  /api/prescription/review    # Get prescriptions for review (pharmacist)
GET  /api/prescription/:id       # Get prescription by ID
PUT  /api/prescription/:id/review # Review prescription (pharmacist)
```

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/avaxen_pharmacy

# JWT Secret (use a strong secret in production)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Seed Database
```bash
npm run seed
```

This creates sample medicines and admin/pharmacist users:
- Admin: admin@avaxen.com / admin123
- Pharmacist: pharmacist@avaxen.com / pharma123

### 5. Start Development Server
```bash
npm run dev
```

The server will start on http://localhost:5000

### 6. Test the API
Visit http://localhost:5000/health to check if the server is running.

## Frontend Integration

To connect your Next.js frontend:

1. Update your frontend API calls to use `http://localhost:5000/api/`
2. Implement JWT token storage and include in headers:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```

## Sample API Usage

### Register User
```javascript
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210"
}
```

### Search Medicines
```javascript
GET /api/medicines?search=paracetamol&category=Pain Relief&sort=price&page=1&limit=10
```

### Add to Cart
```javascript
POST /api/orders/cart/add
{
  "medicineId": "medicine_id_here",
  "quantity": 2
}
```

### Create Order
```javascript
POST /api/orders
{
  "items": [
    {
      "medicineId": "medicine_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+91 9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra", 
    "pincode": "400001"
  },
  "paymentMethod": "razorpay",
  "paymentId": "razorpay_payment_id"
}
```

## Database Models

- **User**: User profiles, addresses, wishlist
- **Medicine**: Medicine catalog with details
- **Order**: Orders with items, payment, shipping
- **Cart**: Shopping cart for users
- **Prescription**: Uploaded prescriptions
- **MedicineScan**: AI medicine scan results

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting (can be added)
- Secure image upload with Cloudinary

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Set up MongoDB Atlas or production database
4. Configure Cloudinary and Razorpay accounts
5. Add rate limiting and additional security middleware
6. Set up proper error logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
