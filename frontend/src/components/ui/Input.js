export default function Input({ label, error, className = '', id, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-lg border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted
          focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors
          ${error ? 'border-danger' : 'border-border'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
