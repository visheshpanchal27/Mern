import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Enhanced security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: false,
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