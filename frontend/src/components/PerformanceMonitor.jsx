import { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          setMetrics(prev => ({
            ...prev,
            loadTime: entry.loadEventEnd - entry.loadEventStart
          }));
        }
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'measure'] });

    // Monitor memory usage
    if ('memory' in performance) {
      const updateMemory = () => {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: performance.memory.usedJSHeapSize / 1048576 // MB
        }));
      };
      
      const interval = setInterval(updateMemory, 5000);
      return () => {
        clearInterval(interval);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
      <div>Render: {metrics.renderTime.toFixed(0)}ms</div>
      <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
    </div>
  );
};

export default PerformanceMonitor;