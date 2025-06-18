'use client';

import dynamic from 'next/dynamic';

const Toaster = dynamic(() => import('@/components/ui/toaster').then(mod => ({ default: mod.Toaster })), {
  ssr: false,
  loading: () => null,
});

const PerformanceWrapper = dynamic(() => import('@/components/performance/PerformanceWrapper').then(mod => ({ default: mod.PerformanceWrapper })), {
  ssr: false,
  loading: () => null,
});

export const ClientWrapper = () => {
  return (
    <>
      <Toaster />
      <PerformanceWrapper />
    </>
  );
}; 