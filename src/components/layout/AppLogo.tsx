
import { HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export function AppLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSizeClass = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  const iconSizeClass = size === 'lg' ? 'h-8 w-8' : size === 'md' ? 'h-7 w-7' : 'h-6 w-6';

  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <HeartHandshake className={`${iconSizeClass} text-accent`} />
      <span className={`font-semibold ${textSizeClass} text-primary`}>
        WarmNest
      </span>
    </Link>
  );
}
