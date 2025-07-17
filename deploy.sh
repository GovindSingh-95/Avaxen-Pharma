#!/bin/bash

# 🚀 Quick Deployment Script for Avaxen B2C Platform

echo "🚀 Starting Avaxen B2C Deployment Process..."
echo "============================================="

# Step 1: Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the root directory containing frontend/ and backend/ folders"
    exit 1
fi

echo "✅ Project structure verified"

# Step 2: Check for git
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed"
    exit 1
fi

echo "✅ Git is available"

# Step 3: Check if repository is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Prepare for B2C deployment - $(date)"
fi

# Step 4: Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub successfully!"

echo ""
echo "🌐 NEXT STEPS - Manual Configuration Required:"
echo "=============================================="
echo ""
echo "1. 🗄️  DATABASE (MongoDB Atlas):"
echo "   • Go to: https://cloud.mongodb.com"
echo "   • Create free cluster"
echo "   • Get connection string"
echo ""
echo "2. 🚀 BACKEND (Railway):"
echo "   • Go to: https://railway.app"
echo "   • Deploy from GitHub > Select backend folder"
echo "   • Set environment variables from backend/.env.example"
echo "   • Note your Railway URL: https://your-app.railway.app"
echo ""
echo "3. 🌐 FRONTEND (Vercel):"
echo "   • Go to: https://vercel.com"
echo "   • Deploy from GitHub > Select frontend folder"
echo "   • Set environment variables from frontend/.env.example"
echo "   • Update NEXT_PUBLIC_API_URL to your Railway URL"
echo ""
echo "4. 🔑 API KEYS NEEDED:"
echo "   • Razorpay: https://dashboard.razorpay.com"
echo "   • Cloudinary: https://cloudinary.com/console"
echo "   • EmailJS: https://www.emailjs.com"
echo "   • Hugging Face: https://huggingface.co/settings/tokens"
echo ""
echo "5. ✅ TEST YOUR DEPLOYMENT:"
echo "   • User registration/login"
echo "   • Browse medicines"
echo "   • Add to cart & checkout"
echo "   • Order tracking"
echo "   • Payment (test mode)"
echo ""
echo "🎉 Your B2C platform will be live in 30-60 minutes!"
echo "📧 Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions"
