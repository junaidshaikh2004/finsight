import { formatCurrency, formatDateLabel } from '@/lib/formatters';
import EmptyState from '@/components/ui/EmptyState';

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No expenses found"
        description="Try adjusting your filters, or add a new expense to get started."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-surface-hover text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {expenses.map((expense) => (
            <tr key={expense.id} className="bg-surface">
              <td className="px-4 py-3 text-foreground whitespace-nowrap">{formatDateLabel(expense.date)}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 text-foreground">
                  {expense.category_name}
                  {expense.is_recurring && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {expense.recurrence_interval}
                    </span>
                  )}
                </span>
              </td>
              <td className="px-4 py-3 text-muted">{expense.description || '—'}</td>
              <td className="px-4 py-3 text-right font-medium text-foreground whitespace-nowrap">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(expense)}
                    aria-label="Edit expense"
                    className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-foreground"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(expense)}
                    aria-label="Delete expense"
                    className="rounded-md p-1.5 text-muted hover:bg-danger-bg hover:text-danger"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
