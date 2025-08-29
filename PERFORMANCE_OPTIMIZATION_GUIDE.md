# ⚡ Performance Optimization Guide

## Frontend Performance Improvements

### 1. **React Optimization Hooks** ✅
```javascript
// Use optimized callbacks to prevent re-renders
import { useOptimizedCallback, useDebouncedCallback } from './hooks/useOptimizedCallback';

// Example usage
const handleSearch = useOptimizedCallback((query) => {
  // Search logic
}, []);

const debouncedSearch = useDebouncedCallback((query) => {
  // API call
}, 300, []);
```

### 2. **Component Memoization** 
```javascript
// Wrap expensive components
const ProductCard = React.memo(({ product }) => {
  return <div>{product.name}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

### 3. **Image Optimization**
```javascript
// Lazy loading images
<img 
  src={product.image} 
  loading="lazy"
  alt={product.name}
  className="w-full h-48 object-cover"
/>

// WebP format with fallback
<picture>
  <source srcSet={`${image}.webp`} type="image/webp" />
  <img src={`${image}.jpg`} alt="Product" />
</picture>
```

## Backend Performance Improvements

### 1. **Database Optimization**
```javascript
// Use lean() for read-only queries
const products = await Product.find({}).lean();

// Index frequently queried fields
// In your MongoDB schema:
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });
```

### 2. **Caching Strategy**
```javascript
// Redis caching for frequently accessed data
import redis from 'redis';
const client = redis.createClient();

// Cache product data
const getCachedProducts = async () => {
  const cached = await client.get('products:all');
  if (cached) return JSON.parse(cached);
  
  const products = await Product.find({}).lean();
  await client.setex('products:all', 300, JSON.stringify(products)); // 5min cache
  return products;
};
```

### 3. **API Response Optimization**
```javascript
// Pagination for large datasets
const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  
  const products = await Product.find({})
    .skip(skip)
    .limit(limit)
    .lean();
    
  res.json({
    products,
    currentPage: page,
    totalPages: Math.ceil(total / limit)
  });
};
```

## Security Performance Balance

### 1. **Efficient Rate Limiting**
```javascript
// Use Redis for distributed rate limiting
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
```

### 2. **Optimized Validation**
```javascript
// Cache validation schemas
const validationCache = new Map();

const getValidationSchema = (type) => {
  if (!validationCache.has(type)) {
    validationCache.set(type, createSchema(type));
  }
  return validationCache.get(type);
};
```

## Monitoring & Metrics

### 1. **Performance Monitoring**
```javascript
// Add performance timing middleware
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  
  next();
};
```

### 2. **Memory Usage Tracking**
```javascript
// Monitor memory usage
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory Usage:', {
    rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB'
  });
}, 30000); // Every 30 seconds
```

## Production Optimizations

### 1. **Build Optimizations**
```javascript
// Vite config optimizations
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', 'framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
};
```

### 2. **CDN Integration**
```javascript
// Serve static assets from CDN
const CDN_URL = process.env.CDN_URL || '';

const getAssetUrl = (path) => {
  return process.env.NODE_ENV === 'production' 
    ? `${CDN_URL}${path}` 
    : path;
};
```

## Performance Testing

### 1. **Load Testing**
```bash
# Use Artillery for load testing
npm install -g artillery

# Create artillery config
echo "config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'API Load Test'
    requests:
      - get:
          url: '/api/products'" > load-test.yml

# Run load test
artillery run load-test.yml
```

### 2. **Frontend Performance**
```javascript
// Measure component render time
const withPerformanceTracking = (WrappedComponent) => {
  return (props) => {
    const start = performance.now();
    
    useEffect(() => {
      const end = performance.now();
      console.log(`${WrappedComponent.name} render time: ${end - start}ms`);
    });
    
    return <WrappedComponent {...props} />;
  };
};
```

## Optimization Checklist

### ✅ Frontend Optimizations
- [ ] React.memo for expensive components
- [ ] useCallback for event handlers
- [ ] useMemo for expensive calculations
- [ ] Lazy loading for images
- [ ] Code splitting for routes
- [ ] Bundle size optimization

### ✅ Backend Optimizations
- [ ] Database indexing
- [ ] Query optimization with lean()
- [ ] Response caching
- [ ] Compression middleware
- [ ] Connection pooling
- [ ] Memory leak prevention

### ✅ Security Performance
- [ ] Efficient rate limiting
- [ ] Cached validation schemas
- [ ] Optimized middleware order
- [ ] Minimal security overhead
- [ ] Fast authentication checks

## Performance Metrics Goals

### Response Times
- **API endpoints**: < 200ms average
- **Database queries**: < 100ms average
- **File uploads**: < 2s for 5MB
- **Page loads**: < 3s initial load

### Resource Usage
- **Memory usage**: < 512MB steady state
- **CPU usage**: < 70% under normal load
- **Database connections**: < 20 concurrent
- **Cache hit ratio**: > 80%

---

## 🚀 Performance Best Practices

1. **Profile before optimizing** - Use tools to identify bottlenecks
2. **Optimize the critical path** - Focus on user-facing performance
3. **Monitor in production** - Track real-world performance
4. **Balance security and speed** - Don't sacrifice security for performance
5. **Regular performance audits** - Schedule monthly performance reviews