'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getCurrentMonth } from '@/lib/formatters';
import BudgetCard from '@/components/budgets/BudgetCard';
import BudgetForm from '@/components/budgets/BudgetForm';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function BudgetsPage() {
  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    apiFetch('/api/categories')
      .then((data) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  async function loadBudgets() {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/api/budgets?month=${month}`);
      setBudgets(data.budgets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(values) {
    await apiFetch('/api/budgets', { method: 'POST', body: values });
    setModalOpen(false);
    loadBudgets();
  }

  async function handleDelete(budget) {
    if (!window.confirm(`Remove the budget for ${budget.category_name}?`)) return;
    try {
      await apiFetch(`/api/budgets/${budget.id}`, { method: 'DELETE' });
      loadBudgets();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Budgets</h1>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Set budget
        </Button>
      </div>

      <Input
        id="budget-month"
        label="Month"
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-44"
      />

      {error && <p className="rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          title="No budgets set for this month"
          description="Set a monthly limit per category to track how close you are to it."
          action={
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Set your first budget
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title="Set budget" onClose={() => setModalOpen(false)}>
          <BudgetForm categories={categories} month={month} onSubmit={handleFormSubmit} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
