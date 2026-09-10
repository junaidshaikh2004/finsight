export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
