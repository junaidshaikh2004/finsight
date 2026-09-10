import { formatCurrency } from '@/lib/formatters';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';

function statusFor(percent) {
  if (percent >= 100) return { bar: 'bg-danger', text: 'text-danger', label: 'Over budget' };
  if (percent >= 70) return { bar: 'bg-warning', text: 'text-warning', label: 'Getting close' };
  return { bar: 'bg-success', text: 'text-success', label: 'On track' };
}

export default function BudgetCard({ budget, onDelete }) {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const percent = Math.min((budget.spent / budget.amount_limit) * 100, 100);
  const actualPercent = (budget.spent / budget.amount_limit) * 100;
  const status = statusFor(actualPercent);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{budget.category_name}</p>
          <p className="mt-0.5 text-sm text-muted">
            {formatCurrency(budget.spent, currency)} of {formatCurrency(budget.amount_limit, currency)}
          </p>
        </div>
        <button
          onClick={() => onDelete(budget)}
          aria-label="Delete budget"
          className="rounded-md p-1.5 text-muted hover:bg-danger-bg hover:text-danger"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" />
          </svg>
        </button>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-hover">
        <div className={`h-full rounded-full ${status.bar} transition-all`} style={{ width: `${percent}%` }} />
      </div>

      <p className={`mt-2 text-xs font-medium ${status.text}`}>
        {status.label} · {actualPercent.toFixed(0)}% used
      </p>
    </Card>
  );
}
