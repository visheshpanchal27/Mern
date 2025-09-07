import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Enhanced security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://www.paypalobjects.com"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "'unsafe-eval'", 
        "https://accounts.google.com", 
        "https://apis.google.com", 
        "https://www.googleapis.com",
        "https://www.paypal.com",
        "https://js.paypal.com"
      ],
      connectSrc: [
        "'self'", 
        "https://api.paypal.com", 
        "https://www.googleapis.com",
        "https://accounts.google.com",
        "https://mernbackend-tmp5.onrender.com"
      ],
      frameSrc: ["'self'", "https://accounts.google.com", "https://www.paypal.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
});

// Rate limiting for different endpoints
export const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Production-ready rate limits
const isProduction = process.env.NODE_ENV === 'production';

export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  isProduction ? 5 : 50, // 5 attempts in production, 50 in development
  'Too many authentication attempts, please try again later'
);

export const uploadRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 uploads
  'Too many upload attempts, please try again later'
);

export const generalRateLimit = createRateLimit(
  1 * 60 * 1000, // 1 minute
  isProduction ? 100 : 10000, // 100 requests in production, 10000 in development
  'Too many requests, please try again later'
);