'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/layout/ThemeToggle';
import CurrencySelector from '@/components/layout/CurrencySelector';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <path d="M3 3v18h18M7 15l4-5 3 3 5-7" />,
  },
  {
    href: '/dashboard/expenses',
    label: 'Expenses',
    icon: <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 12h6M9 16h6" />,
  },
  {
    href: '/dashboard/budgets',
    label: 'Budgets',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  },
  {
    href: '/dashboard/categories',
    label: 'Categories',
    icon: <path d="M4 4h6v6H4V4zM14 4h6v6h-6V4zM4 14h6v6H4v-6zM14 14h6v6h-6v-6z" />,
  },
];

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 3v18h18" />
              <path d="M7 15l4-5 3 3 5-7" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">Finsight</span>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${active ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surface-hover hover:text-foreground'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-4">
        <div className="mb-3 flex items-center justify-between px-3">
          <span className="truncate text-sm text-muted">{user?.name}</span>
          <CurrencySelector />
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  );
}
