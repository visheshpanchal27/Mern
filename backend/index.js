import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';
import compression from 'compression';

import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import productsRouter from './routes/productRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import otpRoutes from './routes/otpRoutes.js';

import connectDB from './config/db.js';
import { rateLimit } from './middlewares/rateLimiter.js';
import { validateEnvironment } from './config/validateEnv.js';
import { securityHeaders, generalRateLimit, authRateLimit } from './middlewares/securityMiddleware.js';
import { generateCSRFToken } from './middlewares/csrfProtection.js';

// ES module dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

// Validate environment variables
validateEnvironment();

// Debug ENV loading
console.log("Loading ENV:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? "Loaded" : "Missing",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing",
  EMAIL_USER: process.env.EMAIL_USER ? "Loaded" : "Missing",
  EMAIL_PASS: process.env.EMAIL_PASS ? "Loaded" : "Missing"
});

const port = process.env.PORT || 5000;

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}
connectDB();

const app = express();

// Trust proxy for deployment platforms like Render
app.set('trust proxy', 1);

// Compression middleware for better performance
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024
}));

// CORS setup
app.use(cors({
  origin: true,
  credentials: true,
  exposedHeaders: ['Authorization', 'Set-Cookie'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Enhanced security headers with Google OAuth fix
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});
app.use(securityHeaders);

// Rate limiting
app.use('/api/', generalRateLimit);
app.use('/api/users/auth', authRateLimit);
app.use('/api/users/register', authRateLimit);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CSRF token generation for authenticated routes
app.use('/api/', generateCSRFToken);

// Routes
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productsRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/otp', otpRoutes);

// PayPal config
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Promo codes
app.post("/api/promo/validate", (req, res) => {
  const { code } = req.body;
  const validCodes = {
    'VISHESH': { discount: 10, type: 'percentage' },
    'INFINITY': { discount: 10, type: 'percentage' },
    'PLAZA': { discount: 10, type: 'percentage' },
    'WELCOME10': { discount: 10, type: 'percentage' }
  };
  
  if (validCodes[code.toUpperCase()]) {
    res.json({ valid: true, ...validCodes[code.toUpperCase()] });
  } else {
    res.status(400).json({ valid: false, message: 'Invalid promo code' });
  }
});

// --------------------------------
// ✅ Serve React frontend in production
// --------------------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // ✅ Handle all non-API routes (fallback to React)
  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      res.status(404).json({ message: "API route not found" });
    } else {
      res.sendFile(path.resolve(frontendPath, "index.html"));
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}


// Start server
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
