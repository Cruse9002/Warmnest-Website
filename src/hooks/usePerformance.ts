import { useCallback, useEffect, useRef } from 'react';
import { debounce, throttle } from '@/lib/performance';

export const usePerformance = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Lazy loading with Intersection Observer
  const useLazyLoad = (callback: () => void, options: IntersectionObserverInit = {}) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === 'undefined') return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback();
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
          ...options,
        }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      observerRef.current = observer;

      return () => {
        observer.disconnect();
      };
    }, [callback, options]);

    return elementRef;
  };

  // Debounced callback
  const useDebouncedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ) => {
    return useCallback(debounce(callback, delay), [callback, delay]);
  };

  // Throttled callback
  const useThrottledCallback = <T extends (...args: any[]) => any>(
    callback: T,
    limit: number
  ) => {
    return useCallback(throttle(callback, limit), [callback, limit]);
  };

  // Performance measurement
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
    } else {
      fn();
    }
  }, []);

  // Memory cleanup
  const cleanupMemory = useCallback(() => {
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc?.();
    }
  }, []);

  // Preload resource
  const preloadResource = useCallback((url: string, type: 'image' | 'script' | 'style' | 'font') => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  }, []);

  // Prefetch resource
  const prefetchResource = useCallback((url: string) => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }, []);

  // Monitor long tasks
  const useLongTaskMonitor = useCallback((threshold: number = 50) => {
    useEffect(() => {
      if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        return;
      }

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > threshold) {
            console.warn('Long task detected:', entry.duration, 'ms');
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    }, [threshold]);
  }, []);

  // Monitor memory usage
  const useMemoryMonitor = useCallback(() => {
    useEffect(() => {
      if (typeof window === 'undefined' || !('memory' in performance)) {
        return;
      }

      const logMemory = () => {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB',
        });
      };

      const interval = setInterval(logMemory, 30000); // Log every 30 seconds

      return () => clearInterval(interval);
    }, []);
  }, []);

  return {
    useLazyLoad,
    useDebouncedCallback,
    useThrottledCallback,
    measurePerformance,
    cleanupMemory,
    preloadResource,
    prefetchResource,
    useLongTaskMonitor,
    useMemoryMonitor,
  };
}; 