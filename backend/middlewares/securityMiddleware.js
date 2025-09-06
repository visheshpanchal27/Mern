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
        "https://mern-u0bv.onrender.com",
        "https://mern-j0z9.onrender.com"
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

// Specific rate limits
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 attempts for development
  'Too many authentication attempts, please try again later'
);

export const uploadRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 uploads
  'Too many upload attempts, please try again later'
);

export const generalRateLimit = createRateLimit(
  1 * 60 * 1000, // 1 minute
  10000, // 10000 requests for development
  'Too many requests, please try again later'
);