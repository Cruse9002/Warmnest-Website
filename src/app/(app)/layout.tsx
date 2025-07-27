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
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AppLogo as MinimalAppLogo } from '@/components/layout/AppLogo';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <MinimalAppLogo size="lg" />
        <Progress value={50} className="w-1/2 sm:w-1/3 md:w-1/4 mt-4" />
        <p className="text-muted-foreground mt-2">Loading your space...</p>
      </div>
    );
  }

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
