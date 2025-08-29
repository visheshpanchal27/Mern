@echo off
echo Installing backend dependencies...
cd backend
npm install express-validator isomorphic-dompurify nodemailer helmet cors express-rate-limit

echo Installing frontend dependencies...
cd ../frontend
npm install react-helmet-async

echo Dependencies installed successfully!
pause