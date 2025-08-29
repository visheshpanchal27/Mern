// Simple in-memory cache (use Redis in production)
const cache = new Map();
const cacheExpiry = new Map();

// Cache middleware
export const cacheMiddleware = (duration = 300) => { // 5 minutes default
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    const expiry = cacheExpiry.get(key);

    // Check if cache exists and is not expired
    if (cachedResponse && expiry && Date.now() < expiry) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache response
    res.json = function(data) {
      // Cache the response
      cache.set(key, data);
      cacheExpiry.set(key, Date.now() + (duration * 1000));
      
      // Clean up expired entries periodically
      if (cache.size > 1000) {
        cleanExpiredCache();
      }

      res.setHeader('X-Cache', 'MISS');
      return originalJson.call(this, data);
    };

    next();
  };
};

// Clean expired cache entries
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, expiry] of cacheExpiry.entries()) {
    if (now >= expiry) {
      cache.delete(key);
      cacheExpiry.delete(key);
    }
  }
};

// Clear cache for specific patterns
export const clearCache = (pattern) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
      cacheExpiry.delete(key);
    }
  }
};

// Cache statistics
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    hitRate: calculateHitRate()
  };
};

let hits = 0;
let misses = 0;

const calculateHitRate = () => {
  const total = hits + misses;
  return total > 0 ? (hits / total * 100).toFixed(2) + '%' : '0%';
};