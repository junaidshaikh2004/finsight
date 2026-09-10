export default function Select({ label, error, className = '', id, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`rounded-lg border bg-surface px-3 py-2 text-sm text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors
          ${error ? 'border-danger' : 'border-border'} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
