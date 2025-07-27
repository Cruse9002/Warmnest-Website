import type { Metadata, Viewport } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';
import { ClientWrapper } from '@/components/layout/ClientWrapper';

// Dynamic imports for better code splitting
const LanguageProvider = dynamic(() => import('@/contexts/LanguageContext').then(mod => ({ default: mod.LanguageProvider })), {
  ssr: true,
});

const AuthProvider = dynamic(() => import('@/contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })), {
  ssr: true,
});

const ThemeProvider = dynamic(() => import('@/contexts/ThemeContext').then(mod => ({ default: mod.ThemeProvider })), {
  ssr: true,
});

// If Geist_Mono is needed, ensure its variable is used in tailwind.config.ts or applied to specific elements
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'WarmNest - Your Companion for Stress Management',
  description: 'WarmNest helps you manage stress with guided exercises, journaling, and chatbot support.',
  metadataBase: new URL('http://localhost:9002'),
  manifest: '/manifest.json',
  openGraph: {
    title: 'WarmNest - Your Companion for Stress Management',
    description: 'WarmNest helps you manage stress with guided exercises, journaling, and chatbot support.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WarmNest - Your Companion for Stress Management',
    description: 'WarmNest helps you manage stress with guided exercises, journaling, and chatbot support.',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'WarmNest',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              {children}
              <ClientWrapper />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
