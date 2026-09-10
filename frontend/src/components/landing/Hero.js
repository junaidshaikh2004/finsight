import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Now with AI-powered insights
      </span>

      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        Know exactly where your money goes.
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
        Finsight tracks your expenses, keeps your budgets honest, and turns your
        spending data into insight — automatically, every month.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/signup">
          <Button variant="primary" className="px-6 py-3 text-base">
            Get started free
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary" className="px-6 py-3 text-base">
            Log in
          </Button>
        </Link>
      </div>

      <DashboardPreview />
    </section>
  );
}

function DashboardPreview() {
  const bars = [40, 65, 50, 80, 60, 95, 70];
  return (
    <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-surface p-6 text-left shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Total spent this month</p>
          <p className="text-2xl font-semibold text-foreground">$2,481.30</p>
        </div>
        <span className="rounded-full bg-success-bg px-3 py-1 text-xs font-medium text-success">
          Under budget
        </span>
      </div>
      <div className="mt-6 flex h-32 items-end gap-3">
        {bars.map((height, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-primary/70" style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted">
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
      </div>
    </div>
  );
}
