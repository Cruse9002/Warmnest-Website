
"use client";

import { AppHeader } from '@/components/layout/AppHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress'; // For loading state

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/auth/login' && pathname !== '/auth/register') {
      router.replace('/auth/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <AppLogo size="lg" />
        <Progress value={50} className="w-1/4 mt-4" />
        <p className="text-muted-foreground mt-2">Loading your space...</p>
      </div>
    );
  }
  
  if (!user && pathname !== '/auth/login' && pathname !== '/auth/register') {
     // This case should ideally be handled by the redirect, but as a fallback:
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
         <p className="text-muted-foreground mt-2">Redirecting to login...</p>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container py-8 max-w-screen-xl">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Warmth Within. All rights reserved.
      </footer>
    </div>
  );
}

// Minimal AppLogo for loading screen
const AppLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const textSizeClass = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  return (
    <div className="flex items-center gap-2 text-primary">
      <span className={`font-semibold ${textSizeClass} text-primary`}>
        Warmth Within
      </span>
    </div>
  );
};
