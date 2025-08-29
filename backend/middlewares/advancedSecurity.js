import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { body, validationResult } from 'express-validator';

// Advanced rate limiting with progressive delays
export const createAdvancedRateLimit = (windowMs, max, delayAfter, delayMs) => {
  const limiter = rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const speedLimiter = slowDown({
    windowMs,
    delayAfter,
    delayMs,
    maxDelayMs: delayMs * 10,
  });

  return [limiter, speedLimiter];
};

// IP-based blocking for suspicious activity
const suspiciousIPs = new Set();
const ipAttempts = new Map();

export const ipSecurityMiddleware = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (suspiciousIPs.has(clientIP)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Track failed attempts
  if (req.path.includes('/auth') && req.method === 'POST') {
    const attempts = ipAttempts.get(clientIP) || 0;
    if (attempts > 10) {
      suspiciousIPs.add(clientIP);
      setTimeout(() => suspiciousIPs.delete(clientIP), 24 * 60 * 60 * 1000); // 24h block
      return res.status(403).json({ error: 'Too many failed attempts' });
    }
  }
  
  next();
};

// Request size limiting
export const requestSizeLimit = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length']);
    const maxBytes = parseInt(maxSize) * 1024 * 1024;
    
    if (contentLength > maxBytes) {
      return res.status(413).json({ error: 'Request too large' });
    }
    next();
  };
};

// Advanced input validation
export const createValidationChain = (rules) => {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }
      next();
    }
  ];
};