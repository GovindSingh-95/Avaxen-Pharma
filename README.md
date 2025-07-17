# 🏥 Avaxan - Online Pharmacy Platform

A comprehensive, production-ready online pharmacy platform built with modern technologies. Avaxan provides a complete solution for managing medicines, processing orders, handling prescriptions, and delivering healthcare products directly to customers.

## ✨ Features

### 🛒 Customer Features
- **Medicine Catalog** - Browse and search through extensive medicine database
- **Smart Medicine Scanner** - AI-powered medicine recognition from images
- **Prescription Upload** - Upload and manage prescriptions securely
- **Shopping Cart** - Add medicines to cart with quantity management
- **Order Tracking** - Real-time order status and delivery tracking
- **User Profiles** - Manage addresses, order history, and preferences
- **Payment Integration** - Secure payments via Razorpay and COD

### 👨‍💼 Admin Features
- **Medicine Management** - Add, edit, and manage medicine inventory
- **Image Upload** - Bulk image upload with automatic optimization
- **Order Management** - Process and track customer orders
- **Prescription Review** - Review and approve uploaded prescriptions
- **Analytics Dashboard** - Monitor sales and inventory metrics

### 🔧 Technical Features
- **Smart Image Fallback** - Multiple fallback layers prevent broken images
- **API Integration** - RESTful APIs with proper error handling
- **Authentication** - JWT-based secure authentication system
- **File Upload** - Cloudinary integration for image management
- **AI-Powered Scanner** - Hugging Face ML models for medicine recognition
- **Notification System** - Email (EmailJS) + SMS (AWS SNS) notifications
- **Indian Medicine Database** - OpenFDA + RxNav + Local database integration
- **Real-time Tracking** - Live delivery tracking with maps
- **Database** - MongoDB with Mongoose ODM
- **Type Safety** - Full TypeScript implementation
- **Production Ready** - Optimized build with Next.js 15
- **Zero API Costs** - All services use FREE tiers

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI + Radix UI
- **State Management**: React Hooks
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary (FREE 25GB)
- **Payment**: Razorpay Integration
- **AI/ML**: Hugging Face (FREE unlimited)
- **Email**: EmailJS (FREE 200/month)
- **SMS**: AWS SNS (FREE 100/month)
- **Medicine Data**: OpenFDA + RxNav APIs (FREE)

## 📁 Project Structure

```
Avaxen/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Order checkout
│   │   ├── medicines/      # Medicine catalog
│   │   ├── profile/        # User profile
│   │   └── ...            # Other pages
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Shadcn/UI components
│   ├── lib/               # Utility functions and API clients
│   └── hooks/             # Custom React hooks
├── backend/                # Node.js backend application
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Express middlewares
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or cloud)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/avaxen.git
cd avaxen
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configurations

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

### 4. Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/avaxen_pharmacy
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (Image Management) - FREE TIER
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay (Payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# EmailJS (Email Notifications) - FREE 200/month
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# AWS SNS (SMS Notifications) - FREE 100/month
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1
AWS_SNS_REGION=ap-south-1

# Hugging Face (AI/ML) - FREE UNLIMITED
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000

# EmailJS (Frontend)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Hugging Face (Frontend)
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key

# Razorpay (Frontend)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🔑 API Keys Setup Guide

### Essential Services (All FREE)

#### 1. 🖼️ Cloudinary (Image Management)
**Time: 2 minutes | Cost: FREE (25GB storage + bandwidth)**
1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up with email
3. Dashboard → Copy: Cloud Name, API Key, API Secret
4. Paste in `.env` file

**Enables**: Medicine images, prescription uploads, medicine scanner

#### 2. 📧 EmailJS (Email Notifications) 
**Time: 5 minutes | Cost: FREE (200 emails/month)**
1. Visit [emailjs.com](https://emailjs.com)  
2. Create account → Add email service (Gmail)
3. Create email template
4. Copy: Service ID, Template ID, Public Key
5. Paste in both `.env` files

**Enables**: Order confirmations, delivery updates, prescription notifications

#### 3. 📱 AWS SNS (SMS for India)
**Time: 10 minutes | Cost: FREE (100 SMS/month for 12 months)**
1. Visit [aws.amazon.com](https://aws.amazon.com)
2. Create free account
3. IAM → Create user with SNS permissions
4. Copy: Access Key ID, Secret Access Key
5. Set region to `ap-south-1` (Mumbai)

**Enables**: Order SMS, delivery updates, OTP verification

#### 4. 🧠 Hugging Face (AI/ML)
**Time: 2 minutes | Cost: FREE (Unlimited with rate limits)**
1. Visit [huggingface.co](https://huggingface.co)
2. Sign up → Settings → Access Tokens
3. Create new token
4. Copy token and paste in `.env` files

**Enables**: Real AI medicine recognition, text extraction, recommendations

### Optional Services

#### 5. 💳 Razorpay (Live Payments)
**Already configured with test keys**
- See `RAZORPAY_LIVE_SETUP.md` for live keys guide
- Test mode works for development

## 🚀 Quick Setup Commands

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Add your API keys to the .env files
# 4. Start services
npm run dev # in both backend and frontend folders
```

## 🔍 Verify Setup

Visit `http://localhost:5000/api/health` to check service status:
```json
{
  "status": "healthy",
  "services": {
    "cloudinary": "configured" | "missing",
    "emailjs": "configured" | "missing",
    "aws_sns": "configured" | "missing",
    "huggingface": "configured" | "missing"
  }
}
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Medicine Endpoints
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get single medicine
- `POST /api/medicines/scan` - AI-powered medicine image scanning
- `GET /api/medicines/scan/:id/result` - Get scan results
- `GET /api/medicines/search` - Search medicines with AI enhancement

### Order Endpoints
- `POST /api/orders` - Create new order (with SMS/Email notifications)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/track/:orderNumber` - Track order status

### Admin Endpoints
- `POST /api/admin/medicines/upload-image` - Upload medicine images (Cloudinary)
- `PUT /api/admin/medicines/:id` - Update medicine
- `GET /api/health` - System health and service status

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Proper error responses without exposing internals
- **CORS Protection** - Configured cross-origin resource sharing
- **File Upload Security** - Safe file handling with type validation

## 🧪 Testing

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run Backend Tests
```bash
cd backend
npm test
```

### Build for Production
```bash
cd frontend
npm run build

cd backend
npm run build
```

## 📈 Performance

- **Build Size**: Frontend optimized to ~120kB main bundle
- **Loading**: Smart lazy loading for components
- **Images**: Automatic optimization via Cloudinary CDN
- **Caching**: Strategic caching for API responses
- **SEO**: Static page generation for better performance
- **AI Processing**: Client-side + server-side ML models
- **Notifications**: Non-blocking email/SMS delivery
- **Zero API Costs**: All services use generous FREE tiers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development**: Your Name
- **Design**: Your Team
- **Project Management**: Your Team

## 📞 Support

For support, email support@avaxen.com or join our Slack channel.

## 🚀 Roadmap

- [x] Complete e-commerce functionality
- [x] AI-powered medicine scanner
- [x] Real-time order tracking with maps
- [x] Email & SMS notification system
- [x] Indian medicine database integration
- [x] Comprehensive admin dashboard
- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Hindi, Regional)
- [ ] AI-powered medicine recommendations
- [ ] Telemedicine integration
- [ ] Insurance claim processing
- [ ] Prescription auto-refill system
- [ ] Medicine interaction checker
- [ ] Loyalty program integration

---

**Made with ❤️ for better healthcare accessibility**
