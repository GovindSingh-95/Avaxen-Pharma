# 🏥 Avaxen - Online Pharmacy Platform

A comprehensive, production-ready online pharmacy platform built with modern technologies. Avaxen provides a complete solution for managing medicines, processing orders, handling prescriptions, and delivering healthcare products directly to customers.

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
- **Database** - MongoDB with Mongoose ODM
- **Type Safety** - Full TypeScript implementation
- **Production Ready** - Optimized build with Next.js 15

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
- **File Storage**: Cloudinary
- **Payment**: Razorpay Integration

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
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy from main branch

### Frontend Deployment (Vercel)
1. Connect your GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set environment variables
4. Deploy from main branch

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Medicine Endpoints
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get single medicine
- `POST /api/medicines/scan` - Scan medicine image

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Admin Endpoints
- `POST /api/admin/medicines/upload-image` - Upload medicine image
- `PUT /api/admin/medicines/:id` - Update medicine

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
- **Images**: Automatic optimization and fallback
- **Caching**: Strategic caching for API responses
- **SEO**: Static page generation for better performance

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

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] AI-powered medicine recommendations
- [ ] Telemedicine integration
- [ ] Insurance claim processing

---

**Made with ❤️ for better healthcare accessibility**
