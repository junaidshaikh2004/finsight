'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getCurrentMonth, formatCurrency, formatMonthLabel } from '@/lib/formatters';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import CategoryBarChart from '@/components/dashboard/CategoryBarChart';
import TrendChart from '@/components/dashboard/TrendChart';
import InsightsPanel from '@/components/dashboard/InsightsPanel';
import Spinner from '@/components/ui/Spinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const month = getCurrentMonth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/api/expenses/summary?month=${month}`)
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [month]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">{formatMonthLabel(month)}</p>
      </div>

      {loading && (
        <div className="flex flex-1 items-center justify-center py-24">
          <Spinner />
        </div>
      )}

      {!loading && error && (
        <p className="rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger">{error}</p>
      )}

      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total spent this month" value={formatCurrency(summary.totalThisMonth, currency)} />
            <StatCard label="Categories with spending" value={summary.byCategory.length} />
            <StatCard
              label="Top category"
              value={summary.byCategory[0]?.category || '—'}
              subtext={summary.byCategory[0] ? formatCurrency(summary.byCategory[0].total, currency) : undefined}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryBarChart data={summary.byCategory} />
            <TrendChart data={summary.trend} />
          </div>

          <InsightsPanel month={month} />
        </>
      )}
    </div>
  );
}
