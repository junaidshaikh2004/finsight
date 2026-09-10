const FEATURES = [
  {
    title: 'Effortless expense tracking',
    description: 'Log expenses in seconds and organize them by category, with search and filters when you need to find one.',
    icon: <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 12h6M9 16h6" />,
  },
  {
    title: 'Smart monthly budgets',
    description: 'Set a limit per category and watch a live progress bar turn from green to red as you approach it.',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  },
  {
    title: 'Recurring expenses',
    description: 'Mark rent or subscriptions as weekly or monthly and Finsight keeps them current automatically.',
    icon: <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />,
  },
  {
    title: 'Visual dashboards',
    description: 'See spend-by-category and month-over-month trends at a glance, not buried in a spreadsheet.',
    icon: <path d="M3 3v18h18M7 15l4-5 3 3 5-7" />,
  },
  {
    title: 'AI-powered insights',
    description: 'One click sends your monthly totals to Gemini and gets back a plain-English read on your habits.',
    icon: <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.14-7.14-1.41 1.41M6.27 17.73l-1.41 1.41m0-14.14 1.41 1.41M17.73 17.73l1.41 1.41M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />,
  },
  {
    title: 'Export anytime',
    description: 'Download your currently filtered expense list as a CSV whenever you need it outside the app.',
    icon: <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Everything you need, nothing you don&apos;t</h2>
        <p className="mt-4 text-muted">
          A focused set of tools for staying on top of your personal finances.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {feature.icon}
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
