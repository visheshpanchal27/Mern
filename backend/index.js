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

import connectDB from './config/db.js';

// ES module dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

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
  "https://shopping-canter.netlify.app",
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

// Security headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/products', productsRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// PayPal config
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Start server
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
