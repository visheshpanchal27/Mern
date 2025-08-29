import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import productsRouter from './routes/productRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

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
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
});

const port = process.env.PORT || 5000;

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}
connectDB();

const app = express();

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-j0z9.onrender.com"
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Authorization', 'Set-Cookie'],
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

// PayPal config
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// --------------------------------
// ✅ Serve React frontend in production
// --------------------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "/frontend/dist");
  app.use(express.static(frontendPath));

  // fallback: send index.html for unknown routes
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(frontendPath, "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Start server
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
