'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getSequentialColor, getChartChrome } from '@/lib/chartColors';
import { formatCurrency, formatMonthLabel } from '@/lib/formatters';
import { getCurrencySymbol } from '@/lib/currencies';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

function ChartTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  const { month, total } = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-foreground">{formatMonthLabel(month)}</p>
      <p className="text-muted">{formatCurrency(total, currency)}</p>
    </div>
  );
}

export default function TrendChart({ data }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const color = getSequentialColor(theme);
  const chrome = getChartChrome(theme);
  const hasData = data.some((row) => row.total > 0);

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-foreground">Spending trend (last 6 months)</h3>
      {!hasData ? (
        <EmptyState title="No trend yet" description="Add expenses over a few months to see how your spending changes." />
      ) : (
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={chrome.grid} />
              <XAxis
                dataKey="month"
                tickFormatter={(m) => formatMonthLabel(m).split(' ')[0]}
                tick={{ fill: chrome.muted, fontSize: 12 }}
                axisLine={{ stroke: chrome.grid }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${getCurrencySymbol(currency)}${v}`}
                tick={{ fill: chrome.muted, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip content={<ChartTooltip currency={currency} />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke={color}
                strokeWidth={2}
                fill="url(#trendFill)"
                dot={{ r: 4, fill: color, stroke: chrome.surfaceHover, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
