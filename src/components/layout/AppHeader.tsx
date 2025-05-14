
"use client";

import Link from 'next/link';
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
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, LogOut, Sun, Moon, Languages } from 'lucide-react'; // Added Languages, Sun, Moon. Removed Palette.
import { AppLogo } from './AppLogo';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter }
from 'next/navigation';


export function AppHeader() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };


  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={user?.photoURL || `https://placehold.co/100x100.png?text=${user?.name?.[0]?.toUpperCase() || 'U'}`} alt={user?.name || 'User'} data-ai-hint="avatar profile" />
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
        <DropdownMenuItem onSelect={navigateToProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>{t('profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLanguageToggle}>
          <Languages className="mr-2 h-4 w-4" />
          <span>{language === 'en' ? t('switchToTamil') : t('switchToEnglish')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          <span>{theme === 'dark' ? t('switchToLightMode') : t('switchToDarkMode')}</span>
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-full px-4 sm:px-6 lg:px-8"> {/* max-w-full for header */}
        <div className="flex items-center gap-2 md:gap-4">
         <SidebarTrigger className="md:hidden" /> {/* Sidebar trigger for mobile */}
         <div className="hidden md:block">
            <AppLogo size="sm"/> {/* Smaller logo for header when sidebar is present */}
         </div>
        </div>

        {/* Centered Logo/Title for mobile when sidebar trigger is shown */}
        <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/dashboard" className="font-semibold text-lg text-primary">WarmNest</Link>
        </div>

        <div className="flex items-center gap-3">
          {loading ? null : user ? <UserMenu /> : <AuthButtons />}
        </div>
      </div>
    </header>
  );
}
