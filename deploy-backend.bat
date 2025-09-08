@echo off
echo Deploying backend to Render...

cd backend
git add .
git commit -m "Add cart routes and controllers"
git push origin main

echo Backend deployment initiated!
echo Check Render dashboard for deployment status.
pause