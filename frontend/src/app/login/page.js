'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm p-8">
        <Link href="/" className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 3v18h18" />
              <path d="M7 15l4-5 3 3 5-7" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">Finsight</span>
        </Link>

        <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Log in to keep tracking your spending.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
          )}

          <Button type="submit" variant="primary" loading={submitting} className="mt-2 w-full">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:text-primary-hover">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
