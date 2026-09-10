'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CURRENCIES } from '@/lib/currencies';

export default function CurrencySelector() {
  const { user, updateCurrency } = useAuth();
  const [saving, setSaving] = useState(false);

  async function handleChange(e) {
    const currency = e.target.value;
    setSaving(true);
    try {
      await updateCurrency(currency);
    } catch {
      // Non-critical preference — silently leave the selector at the last-saved value.
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={user?.currency || 'USD'}
      onChange={handleChange}
      disabled={saving}
      aria-label="Currency"
      className="h-9 rounded-lg border border-border bg-surface px-2 text-sm text-foreground
        focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  );
}
