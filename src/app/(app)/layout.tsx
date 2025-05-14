
"use client";

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarInset, 
  SidebarRail 
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AppLogo as MinimalAppLogo } from '@/components/layout/AppLogo';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect handles redirection if auth state changes *after* initial load
    if (!loading && !user) {
      // Avoid redirecting if already on an auth page (though this layout shouldn't wrap them)
      // This check is more of a safeguard.
      if (pathname !== '/auth/login' && pathname !== '/auth/register') {
        router.replace('/auth/login');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <MinimalAppLogo size="lg" />
        <Progress value={50} className="w-1/2 sm:w-1/3 md:w-1/4 mt-4" />
        <p className="text-muted-foreground mt-2">Loading your space...</p>
      </div>
    );
  }
  
  // If not loading, and still no user, and not on an auth page (this condition should ideally not be met often here due to useEffect)
  // This ensures that if the useEffect hasn't redirected yet, we still don't render children.
  if (!user && pathname !== '/auth/login' && pathname !== '/auth/register') {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
         <MinimalAppLogo size="lg" />
         <p className="text-muted-foreground mt-4">Redirecting to login...</p>
      </div>
    );
  }

  // If user is null but we are on an auth page (which this layout shouldn't wrap), 
  // or if user exists, then render the layout.
  // The primary protection for app routes is the above block.
  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <SidebarRail />
      <SidebarInset> {/* SidebarInset is a <main> tag with flex flex-col */}
        <AppHeader />
        {/* This div wraps the page children to provide padding and flex-grow */}
        <div className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </div>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} WarmNest. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
