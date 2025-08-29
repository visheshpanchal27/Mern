@echo off
echo ========================================
echo   FIXING GOOGLE OAUTH ERRORS
echo ========================================
echo.

echo 🔧 Fixed Issues:
echo.
echo ✅ Cross-Origin-Opener-Policy Error:
echo   • Updated security headers to allow OAuth popups
echo   • Set Cross-Origin-Opener-Policy to 'same-origin-allow-popups'
echo   • Added Google APIs to CSP connectSrc
echo.
echo ✅ 500 Internal Server Error:
echo   • Added 'image' field to User model
echo   • Added 'isGoogleUser' flag for Google users
echo   • Fixed Google Auth controller validation
echo.

echo 📝 Changes Made:
echo.
echo Backend Security:
echo   • Fixed CORS policy for Google OAuth
echo   • Updated CSP to allow googleapis.com
echo   • Disabled crossOriginOpenerPolicy in helmet
echo.
echo User Model:
echo   • Added image field (String, default: '')
echo   • Enhanced Google user tracking
echo.
echo Google Auth Controller:
echo   • Proper error handling
echo   • Input validation and sanitization
echo   • JWT token generation
echo.

echo 🚀 Google OAuth should now work without errors!
echo.
pause