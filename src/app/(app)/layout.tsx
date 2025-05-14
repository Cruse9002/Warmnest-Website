
"use client";

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar'; // Import new AppSidebar
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarInset, 
  SidebarRail 
} from '@/components/ui/sidebar'; // Import sidebar components
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AppLogo as MinimalAppLogo } from '@/components/layout/AppLogo'; // Renamed for clarity

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
        <MinimalAppLogo size="lg" />
        <Progress value={50} className="w-1/4 mt-4" />
        <p className="text-muted-foreground mt-2">Loading your space...</p>
      </div>
    );
  }
  
  if (!user && pathname !== '/auth/login' && pathname !== '/auth/register') {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
         <p className="text-muted-foreground mt-2">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen flex-col bg-secondary/30 dark:bg-background"> {/* Changed background for better contrast with inset */}
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <SidebarRail />
        <SidebarInset>
          <AppHeader /> {/* AppHeader might need SidebarTrigger now */}
          <main className="flex-1 p-4 sm:p-6 md:p-8"> {/* Added padding here */}
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground border-t">
            © {new Date().getFullYear()} Warmth Within. All rights reserved.
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
