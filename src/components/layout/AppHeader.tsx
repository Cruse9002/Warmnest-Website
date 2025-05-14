
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, MessageCircle, User, LogOut, Sun, Moon, Menu, Brain, Wind, BookOpen } from 'lucide-react';
import { AppLogo } from './AppLogo';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', labelKey: 'dashboard', icon: Home },
  { href: '/breathing', labelKey: 'breathingExercises', icon: Wind },
  { href: '/chatbot', labelKey: 'chatbot', icon: MessageCircle },
  { href: '/journal', labelKey: 'journal', icon: BookOpen },
  { href: '/profile', labelKey: 'profile', icon: User },
] as const;


export function AppHeader() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { user, logout, loading } = useAuth();

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${user?.name?.[0]?.toUpperCase() || 'U'}`} alt={user?.name || 'User'} data-ai-hint="avatar profile" />
            <AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || t('profile')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>{t('profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleLanguage}>
          {language === 'en' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
          <span>{language === 'en' ? t('tamil') : t('english')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  const AuthButtons = () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/auth/login">{t('login')}</Link>
      </Button>
      <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/auth/register">{t('register')}</Link>
      </Button>
    </div>
  );

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  );
  
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-background">
        <nav className="grid gap-6 text-lg font-medium mt-8">
          <div className="mb-4 ml-2">
             <AppLogo size="md" />
          </div>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === link.href ? "bg-muted text-primary" : "text-muted-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-screen-2xl">
        <div className="flex items-center gap-4">
         <MobileNav />
         <div className="hidden md:block">
            <AppLogo />
         </div>
        </div>
        <div className="md:hidden"> {/* Logo for mobile centered when menu is not open. Or simple name. */}
            <Link href="/dashboard" className="font-semibold text-lg text-primary">Warmth Within</Link>
        </div>

        <DesktopNav />

        <div className="flex items-center gap-4">
          {loading ? null : user ? <UserMenu /> : <AuthButtons />}
        </div>
      </div>
    </header>
  );
}

// Minimal router for dropdown, actual navigation via Link or programmatic
const router = { push: (path: string) => { window.location.href = path; }};
