'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/layout/ThemeToggle';
import Button from '@/components/ui/Button';

export default function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 3v18h18" />
              <path d="M7 15l4-5 3 3 5-7" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">Finsight</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
