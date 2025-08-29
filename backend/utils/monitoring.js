import os from 'os';

// System metrics collection
class SystemMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      memoryUsage: [],
      cpuUsage: [],
      activeConnections: 0
    };
    
    this.startTime = Date.now();
    this.startMonitoring();
  }

  // Start periodic monitoring
  startMonitoring() {
    setInterval(() => {
      this.collectSystemMetrics();
      this.cleanOldMetrics();
    }, 30000); // Every 30 seconds
  }

  // Collect system metrics
  collectSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    this.metrics.memoryUsage.push({
      timestamp: Date.now(),
      rss: memUsage.rss,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal
    });

    this.metrics.cpuUsage.push({
      timestamp: Date.now(),
      user: cpuUsage.user,
      system: cpuUsage.system
    });
  }

  // Clean old metrics (keep last hour)
  cleanOldMetrics() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    this.metrics.responseTime = this.metrics.responseTime.filter(
      metric => metric.timestamp > oneHourAgo
    );
    
    this.metrics.memoryUsage = this.metrics.memoryUsage.filter(
      metric => metric.timestamp > oneHourAgo
    );
    
    this.metrics.cpuUsage = this.metrics.cpuUsage.filter(
      metric => metric.timestamp > oneHourAgo
    );
  }

  // Record request
  recordRequest(responseTime) {
    this.metrics.requests++;
    this.metrics.responseTime.push({
      timestamp: Date.now(),
      duration: responseTime
    });
  }

  // Record error
  recordError() {
    this.metrics.errors++;
  }

  // Get current metrics
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.calculateAverageResponseTime();
    
    return {
      uptime: Math.floor(uptime / 1000), // in seconds
      requests: this.metrics.requests,
      errors: this.metrics.errors,
      errorRate: this.metrics.requests > 0 ? 
        (this.metrics.errors / this.metrics.requests * 100).toFixed(2) + '%' : '0%',
      averageResponseTime: avgResponseTime + 'ms',
      currentMemory: this.getCurrentMemoryUsage(),
      systemInfo: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        totalMemory: Math.round(os.totalmem() / 1024 / 1024) + 'MB',
        freeMemory: Math.round(os.freemem() / 1024 / 1024) + 'MB'
      }
    };
  }

  calculateAverageResponseTime() {
    if (this.metrics.responseTime.length === 0) return 0;
    
    const total = this.metrics.responseTime.reduce((sum, metric) => sum + metric.duration, 0);
    return Math.round(total / this.metrics.responseTime.length);
  }

  getCurrentMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB'
    };
  }
}

// Create global monitor instance
export const systemMonitor = new SystemMonitor();

// Monitoring middleware
export const monitoringMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    systemMonitor.recordRequest(responseTime);
    
    if (res.statusCode >= 400) {
      systemMonitor.recordError();
    }
  });
  
  next();
};

// Health check endpoint data
export const getHealthStatus = () => {
  const metrics = systemMonitor.getMetrics();
  const memUsage = process.memoryUsage();
  
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: metrics.uptime,
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    },
    requests: metrics.requests,
    errors: metrics.errors,
    errorRate: metrics.errorRate
  };
};