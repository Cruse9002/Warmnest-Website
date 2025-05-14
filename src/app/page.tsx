
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { AppLogo } from '@/components/layout/AppLogo';


export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

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
      <Progress value={50} className="w-1/2 md:w-1/4 mb-4" />
      <p className="text-muted-foreground text-lg">Initializing your space...</p>
      <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare Warmth Within for you.</p>
    </div>
  );
}
