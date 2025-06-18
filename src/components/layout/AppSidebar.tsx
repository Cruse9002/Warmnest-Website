"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import { AppLogo } from './AppLogo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Home, MessageCircle, User, LogOut, Sun, Moon, Settings, Wind, BookOpen, Music2, Brain, Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavLinks = [
  { href: '/dashboard', labelKey: 'dashboard', icon: Home },
  { href: '/breathing', labelKey: 'breathingExercises', icon: Wind },
  { href: '/chatbot', labelKey: 'chatbot', icon: MessageCircle },
  { href: '/journal', labelKey: 'journal', icon: BookOpen },
  { href: '/music-therapy', labelKey: 'musicTherapy', icon: Music2 },
  { href: '/focus-mode', labelKey: 'focusMode', icon: Brain },
] as const;

const accountNavLinks = [
    { href: '/profile', labelKey: 'profile', icon: User },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { state: sidebarState } = useSidebar();

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  return (
    <>
      <SidebarHeader>
        <AppLogo size={sidebarState === 'collapsed' ? 'sm' : 'md'} />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {mainNavLinks.map(link => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={sidebarState === 'collapsed' ? t(link.labelKey) : undefined}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{t(link.labelKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarGroup className="mt-auto pt-4"> 
            <SidebarGroupLabel className="flex items-center">
                <Settings className="mr-2" /> {t('profile')}
            </SidebarGroupLabel>
            <SidebarMenu>
                 {accountNavLinks.map(link => (
                    <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === link.href}
                        tooltip={sidebarState === 'collapsed' ? t(link.labelKey) : undefined}
                    >
                        <Link href={link.href}>
                        <link.icon />
                        <span>{t(link.labelKey)}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={handleLanguageToggle}
                        tooltip={sidebarState === 'collapsed' ? (language === 'en' ? t('switchToTamil') : t('switchToEnglish')) : undefined}
                    >
                        <Languages />
                        <span>{language === 'en' ? t('switchToTamil') : t('switchToEnglish')}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={toggleTheme}
                        tooltip={sidebarState === 'collapsed' ? (theme === 'dark' ? t('switchToLightMode') : t('switchToDarkMode')) : undefined}
                    >
                        {theme === 'dark' ? <Sun /> : <Moon />}
                        <span>{theme === 'dark' ? t('switchToLightMode') : t('switchToDarkMode')}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {user && (
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-md transition-all",
            sidebarState === 'collapsed' ? "justify-center" : ""
          )}>
            <Avatar className="h-9 w-9 border-2 border-primary">
              <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png?text=${user.name?.[0]?.toUpperCase() || 'U'}`} alt={user.name || "User Avatar"} />
              <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            {sidebarState === 'expanded' && (
              <div className="flex-1 overflow-hidden min-w-0">
                <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
             {sidebarState === 'expanded' && (
                <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground hover:text-destructive" aria-label={t('logout')}>
                    <LogOut size={18} />
                </Button>
             )}
          </div>
        )}
         {sidebarState === 'collapsed' && user && (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={signOut} tooltip={t('logout')}>
                        <LogOut />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
         )}
      </SidebarFooter>
    </>
  );
}
