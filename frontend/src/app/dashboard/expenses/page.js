'use client';

import { useEffect, useState } from 'react';
import { apiFetch, downloadExport } from '@/lib/api';
import { getCurrentMonth } from '@/lib/formatters';
import ExpenseFilters from '@/components/expenses/ExpenseFilters';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';

export default function ExpensesPage() {
  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [categoryId, setCategoryId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [expenses, setExpenses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    apiFetch('/api/categories')
      .then((data) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  // Debounce the search box so we're not firing a request per keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Reset to page 1 whenever a filter changes, so we don't stay on e.g. page
  // 3 of a now-empty result set. This adjusts state during render (React's
  // documented pattern for "derived state that resets when an input
  // changes") instead of an extra effect + re-render round trip.
  const [prevFilters, setPrevFilters] = useState({ month, categoryId, search });
  if (prevFilters.month !== month || prevFilters.categoryId !== categoryId || prevFilters.search !== search) {
    setPrevFilters({ month, categoryId, search });
    if (page !== 1) setPage(1);
  }

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, categoryId, search, page]);

  async function loadExpenses() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ month, page: String(page), limit: '10' });
      if (categoryId) params.set('category_id', categoryId);
      if (search) params.set('search', search);
      const data = await apiFetch(`/api/expenses?${params.toString()}`);
      setExpenses(data.expenses);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingExpense(null);
    setModalOpen(true);
  }

  function openEditModal(expense) {
    setEditingExpense(expense);
    setModalOpen(true);
  }

  async function handleFormSubmit(values) {
    if (editingExpense) {
      await apiFetch(`/api/expenses/${editingExpense.id}`, { method: 'PUT', body: values });
    } else {
      await apiFetch('/api/expenses', { method: 'POST', body: values });
    }
    setModalOpen(false);
    loadExpenses();
  }

  async function handleDelete(expense) {
    const label = expense.description || expense.category_name;
    if (!window.confirm(`Delete "${label}"? This can't be undone.`)) return;
    try {
      await apiFetch(`/api/expenses/${expense.id}`, { method: 'DELETE' });
      loadExpenses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleExport() {
    const params = new URLSearchParams({ month });
    if (categoryId) params.set('category_id', categoryId);
    if (search) params.set('search', search);
    try {
      await downloadExport(`/api/expenses/export?${params.toString()}`, `expenses-${month}.csv`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Expenses</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={openAddModal}>
            Add expense
          </Button>
        </div>
      </div>

      <ExpenseFilters
        categories={categories}
        month={month}
        onMonthChange={setMonth}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        search={searchInput}
        onSearchChange={setSearchInput}
      />

      {error && <p className="rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <ExpenseTable expenses={expenses} onEdit={openEditModal} onDelete={handleDelete} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {modalOpen && (
        <Modal title={editingExpense ? 'Edit expense' : 'Add expense'} onClose={() => setModalOpen(false)}>
          <ExpenseForm
            categories={categories}
            initialValues={editingExpense}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
