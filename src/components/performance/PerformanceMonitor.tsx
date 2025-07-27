'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

export const PerformanceMonitor = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries[entries.length - 1];
      metricsRef.current.fcp = fcpEntry.startTime;
      console.log('FCP:', fcpEntry.startTime);
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcpEntry = entries[entries.length - 1];
      metricsRef.current.lcp = lcpEntry.startTime;
      console.log('LCP:', lcpEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming;
        metricsRef.current.fid = fidEntry.processingStart - fidEntry.startTime;
        console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          metricsRef.current.cls = clsValue;
          console.log('CLS:', clsValue);
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      metricsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      console.log('TTFB:', navigationEntry.responseStart - navigationEntry.requestStart);
    }

    // Long tasks monitoring
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry.duration, 'ms');
        }
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Memory monitoring
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('Memory usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB',
      });
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      longTaskObserver.disconnect();
    };
  }, []);

  // Report metrics to analytics (if needed)
  useEffect(() => {
    const reportMetrics = () => {
      // Send metrics to analytics service
      console.log('Performance metrics:', metricsRef.current);
    };

    // Report after 5 seconds
    const timer = setTimeout(reportMetrics, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}; 