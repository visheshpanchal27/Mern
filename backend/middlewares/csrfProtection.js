import crypto from 'crypto';

// Simple CSRF token generation and validation
const csrfTokens = new Map();

export const generateCSRFToken = (req, res, next) => {
  const token = crypto.randomBytes(32).toString('hex');
  const userId = req.user?._id || req.ip;
  
  csrfTokens.set(userId, token);
  
  // Clean up old tokens (simple cleanup)
  if (csrfTokens.size > 1000) {
    const keys = Array.from(csrfTokens.keys());
    keys.slice(0, 100).forEach(key => csrfTokens.delete(key));
  }
  
  res.setHeader('X-CSRF-Token', token);
  req.csrfToken = token;
  next();
};

export const validateCSRFToken = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next();
  }
  
  const token = req.headers['x-csrf-token'];
  const userId = req.user?._id || req.ip;
  
  if (!token || !csrfTokens.has(userId) || csrfTokens.get(userId) !== token) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  
  next();
};