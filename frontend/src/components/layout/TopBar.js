'use client';

import ThemeToggle from '@/components/layout/ThemeToggle';

export default function TopBar({ onMenuClick }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-hover"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
      <span className="text-base font-semibold text-foreground">Finsight</span>
      <ThemeToggle />
    </div>
  );
}
