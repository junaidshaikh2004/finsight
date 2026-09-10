export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 px-6 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
