'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/categories');
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch('/api/categories', { method: 'POST', body: { name: newName.trim() } });
      setNewName('');
      loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const defaultCategories = categories.filter((c) => c.is_default);
  const customCategories = categories.filter((c) => !c.is_default);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-muted">Organize your expenses by category.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-medium text-foreground">Add a custom category</h2>
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            id="new-category"
            label="Category name"
            type="text"
            placeholder="e.g. Subscriptions"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="sm:w-64"
          />
          <Button type="submit" variant="primary" loading={submitting}>
            Add category
          </Button>
        </form>
        {error && <p className="mt-3 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>}
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-sm font-medium text-foreground">Default categories</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {defaultCategories.map((cat) => (
                <li key={cat.id} className="rounded-lg bg-surface-hover px-3 py-2 text-sm text-foreground">
                  {cat.name}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-medium text-foreground">Your custom categories</h2>
            {customCategories.length === 0 ? (
              <p className="mt-3 text-sm text-muted">You haven&apos;t added any custom categories yet.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {customCategories.map((cat) => (
                  <li key={cat.id} className="rounded-lg bg-surface-hover px-3 py-2 text-sm text-foreground">
                    {cat.name}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
