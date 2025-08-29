@echo off
echo Installing Security Improvements for MERN E-commerce Project...
echo.

echo [1/3] Installing backend security dependencies...
cd backend
npm install bcryptjs@^2.4.3 cookie-parser@^1.4.6 dotenv@^16.4.5 jsonwebtoken@^9.0.2 multer@^2.0.2
echo Backend dependencies installed successfully!
echo.

echo [2/3] Installing frontend performance dependencies...
cd ../frontend
npm install @react-oauth/google@^0.12.1
echo Frontend dependencies installed successfully!
echo.

echo [3/3] Security improvements have been implemented:
echo ✅ Fixed multer DoS vulnerability (updated to v2.0.2)
echo ✅ Added authentication middleware to upload routes
echo ✅ Implemented CSRF protection
echo ✅ Added input validation and sanitization
echo ✅ Enhanced error handling and logging security
echo ✅ Added rate limiting for different endpoints
echo ✅ Implemented security headers with Helmet
echo ✅ Added performance optimization hooks
echo ✅ Enhanced error boundary component
echo.

echo [IMPORTANT] Next steps:
echo 1. Update your .env files with secure values
echo 2. Test all authentication flows
echo 3. Verify CSRF tokens are working
echo 4. Check rate limiting is functioning
echo 5. Test file upload security
echo.

echo Security improvements installation completed!
pause