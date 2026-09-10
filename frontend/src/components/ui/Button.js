const VARIANTS = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-surface text-foreground border border-border hover:bg-surface-hover',
  danger: 'bg-danger text-white hover:opacity-90',
  ghost: 'text-foreground hover:bg-surface-hover',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
        transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
