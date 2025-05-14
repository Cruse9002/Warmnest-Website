
import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Removed Geist_Mono as it's not explicitly used for --font-geist-mono in body
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext'; // Added ThemeProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// If Geist_Mono is needed, ensure its variable is used in tailwind.config.ts or applied to specific elements
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Warmth Within - Your Companion for Stress Management',
  description: 'Warmth Within helps you manage stress with guided exercises, journaling, and chatbot support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning for theme persistence */}
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider> {/* Wrapped with ThemeProvider */}
              {children}
              <Toaster />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
