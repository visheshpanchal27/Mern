@echo off
echo.
echo ========================================
echo   SECURITY FIX - AUTOMATED SCRIPT
echo ========================================
echo.
echo Step 1: Generating new strong secrets...
echo.
node generate-secrets.js
echo.
echo.
echo Step 2: Running security verification...
echo.
node verify-security.js
echo.
echo.
echo ========================================
echo   NEXT STEPS (MANUAL):
echo ========================================
echo.
echo 1. Copy the JWT secrets shown above
echo 2. Open backend\.env in a text editor
echo 3. Replace JWT_WEB_SECRET and JWT_MOBILE_SECRET
echo 4. Save the file
echo.
echo 5. Update Render:
echo    - Go to: https://dashboard.render.com
echo    - Select: mernbackend-tmp5
echo    - Environment tab
echo    - Update JWT_WEB_SECRET and JWT_MOBILE_SECRET
echo    - Save (auto-redeploys)
echo.
echo 6. Run this script again to verify
echo.
pause
