// Simple rate limiting middleware
const rateLimitStore = new Map();

export const rateLimit = (maxRequests = 1000, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitStore.has(clientId)) {
      rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const clientData = rateLimitStore.get(clientId);
    
    if (now > clientData.resetTime) {
      rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({ 
        message: 'Too many requests, please try again later.' 
      });
    }
    
    clientData.count++;
    next();
  };
};