'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { getCategoricalColors, getChartChrome, foldIntoOther } from '@/lib/chartColors';
import { formatCurrency } from '@/lib/formatters';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-foreground">{category}</p>
      <p className="text-muted">{formatCurrency(total)}</p>
    </div>
  );
}

export default function CategoryBarChart({ data }) {
  const { theme } = useTheme();
  const colors = getCategoricalColors(theme);
  const chrome = getChartChrome(theme);
  const rows = foldIntoOther([...data].sort((a, b) => b.total - a.total));

  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-foreground">Spend by category</h3>
      {rows.length === 0 ? (
        <EmptyState title="No expenses yet" description="Add an expense to see your spending by category." />
      ) : (
        <div className="mt-4" style={{ height: Math.max(rows.length * 44, 120) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid horizontal={false} stroke={chrome.grid} />
              <XAxis type="number" tick={{ fill: chrome.muted, fontSize: 12 }} tickFormatter={(v) => `$${v}`} axisLine={{ stroke: chrome.grid }} tickLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                width={100}
                tick={{ fill: chrome.foreground, fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: chrome.surfaceHover }} />
              <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {rows.map((row, index) => (
                  <Cell key={row.category} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
