@echo off
REM 🚀 Quick Deployment Script for Avaxen B2C Platform (Windows)

echo 🚀 Starting Avaxen B2C Deployment Process...
echo =============================================

REM Step 1: Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: frontend folder not found
    echo Please run this script from the root directory containing frontend/ and backend/ folders
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Error: backend folder not found
    echo Please run this script from the root directory containing frontend/ and backend/ folders
    pause
    exit /b 1
)

echo ✅ Project structure verified

REM Step 2: Check for git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Git is not installed
    pause
    exit /b 1
)

echo ✅ Git is available

REM Step 3: Commit and push changes
echo 📝 Committing any changes...
git add .
git commit -m "Prepare for B2C deployment - %date% %time%"

REM Step 4: Push to GitHub
echo 📤 Pushing to GitHub...
git push origin main

echo ✅ Code pushed to GitHub successfully!
echo.
echo 🌐 NEXT STEPS - Manual Configuration Required:
echo ==============================================
echo.
echo 1. 🗄️  DATABASE (MongoDB Atlas):
echo    • Go to: https://cloud.mongodb.com
echo    • Create free cluster
echo    • Get connection string
echo.
echo 2. 🚀 BACKEND (Railway):
echo    • Go to: https://railway.app
echo    • Deploy from GitHub ^> Select backend folder
echo    • Set environment variables from backend\.env.example
echo    • Note your Railway URL: https://your-app.railway.app
echo.
echo 3. 🌐 FRONTEND (Vercel):
echo    • Go to: https://vercel.com
echo    • Deploy from GitHub ^> Select frontend folder
echo    • Set environment variables from frontend\.env.example
echo    • Update NEXT_PUBLIC_API_URL to your Railway URL
echo.
echo 4. 🔑 API KEYS NEEDED:
echo    • Razorpay: https://dashboard.razorpay.com
echo    • Cloudinary: https://cloudinary.com/console
echo    • EmailJS: https://www.emailjs.com
echo    • Hugging Face: https://huggingface.co/settings/tokens
echo.
echo 5. ✅ TEST YOUR DEPLOYMENT:
echo    • User registration/login
echo    • Browse medicines
echo    • Add to cart ^& checkout
echo    • Order tracking
echo    • Payment (test mode)
echo.
echo 🎉 Your B2C platform will be live in 30-60 minutes!
echo 📧 Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
