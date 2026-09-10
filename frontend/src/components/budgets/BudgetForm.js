'use client';

import { useEffect, useState } from 'react';
import { formatMonthLabel } from '@/lib/formatters';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function BudgetForm({ categories, month, onSubmit, onCancel }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');

  // See ExpenseForm's identical effect: categories can still be loading
  // when this form first mounts, so sync the default once they arrive.
  useEffect(() => {
    if (categoryId === '' && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);
  const [amountLimit, setAmountLimit] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ category_id: Number(categoryId), month, amount_limit: Number(amountLimit) });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-muted">Setting a budget for {formatMonthLabel(month)}</p>

      <Select id="budget-category" label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>

      <Input
        id="budget-amount"
        label="Monthly limit"
        type="number"
        step="0.01"
        min="0.01"
        value={amountLimit}
        onChange={(e) => setAmountLimit(e.target.value)}
        required
      />

      {error && <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          Save budget
        </Button>
      </div>
    </form>
  );
}
