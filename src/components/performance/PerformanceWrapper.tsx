'use client';

import dynamic from 'next/dynamic';

const PerformanceMonitor = dynamic(() => import('./PerformanceMonitor').then(mod => ({ default: mod.PerformanceMonitor })), {
  ssr: false,
  loading: () => null,
});

const ServiceWorkerRegistration = dynamic(() => import('./ServiceWorkerRegistration').then(mod => ({ default: mod.ServiceWorkerRegistration })), {
  ssr: false,
  loading: () => null,
});

export const PerformanceWrapper = () => {
  return (
    <>
      <PerformanceMonitor />
      <ServiceWorkerRegistration />
    </>
  );
}; 