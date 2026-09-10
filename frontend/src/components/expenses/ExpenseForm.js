'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const TODAY = new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ categories, initialValues, onSubmit, onCancel }) {
  const [categoryId, setCategoryId] = useState(initialValues?.category_id ?? categories[0]?.id ?? '');

  // Categories load asynchronously; if this form mounted before they arrived,
  // categoryId's initial value falls back to '' and never gets to see the
  // list. Once categories show up, default to the first one.
  useEffect(() => {
    if (!initialValues && categoryId === '' && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);
  const [amount, setAmount] = useState(initialValues?.amount ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [date, setDate] = useState(initialValues?.date ?? TODAY);
  const [isRecurring, setIsRecurring] = useState(initialValues?.is_recurring ?? false);
  const [recurrenceInterval, setRecurrenceInterval] = useState(initialValues?.recurrence_interval ?? 'monthly');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        category_id: Number(categoryId),
        amount: Number(amount),
        description,
        date,
        is_recurring: isRecurring,
        recurrence_interval: isRecurring ? recurrenceInterval : null,
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        id="category"
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>

      <Input
        id="amount"
        label="Amount"
        type="number"
        step="0.01"
        min="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Input
        id="description"
        label="Description"
        type="text"
        placeholder="e.g. Groceries"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        id="date"
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-[var(--primary)]"
        />
        This expense repeats
      </label>

      {isRecurring && (
        <Select
          id="recurrenceInterval"
          label="Repeats every"
          value={recurrenceInterval}
          onChange={(e) => setRecurrenceInterval(e.target.value)}
        >
          <option value="weekly">Week</option>
          <option value="monthly">Month</option>
        </Select>
      )}

      {error && <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>}

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {initialValues ? 'Save changes' : 'Add expense'}
        </Button>
      </div>
    </form>
  );
}
