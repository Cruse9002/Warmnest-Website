"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { AppLogo } from '@/components/layout/AppLogo';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.onboarded) {
          router.replace('/dashboard');
        } else {
          router.replace('/onboarding');
        }
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-center p-4">
      <div className="mb-8">
        <AppLogo size="lg" />
      </div>
      <Progress value={50} className="w-1/2 sm:w-1/3 md:w-1/4 mb-4" />
      <p className="text-muted-foreground text-base sm:text-lg">
        {loading ? 'Initializing your space...' : 'Welcome to WarmNest'}
      </p>
      <p className="text-xs sm:text-sm text-muted-foreground mt-2">
        {loading ? 'Please wait while we prepare WarmNest for you.' : 'Your mental wellness companion'}
      </p>
    </div>
  );
}
