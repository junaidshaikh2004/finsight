'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { formatMonthLabel } from '@/lib/formatters';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function InsightsPanel({ month }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/insights', { method: 'POST', body: { month } });
      setInsights(data.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">AI spending insights</h3>
          <p className="mt-1 text-sm text-muted">
            A quick, AI-generated read on your {formatMonthLabel(month)} spending.
          </p>
        </div>
        <Button variant="primary" onClick={handleGenerate} loading={loading}>
          {insights ? 'Regenerate' : 'Generate insights'}
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
      )}

      {!error && loading && (
        <p className="mt-4 text-sm text-muted">Analyzing your spending…</p>
      )}

      {!loading && insights && (
        <p className="mt-4 whitespace-pre-line rounded-lg bg-surface-hover p-4 text-sm leading-relaxed text-foreground">
          {insights}
        </p>
      )}
    </Card>
  );
}
