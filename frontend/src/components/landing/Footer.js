export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Finsight. Built as a portfolio project.</p>
        <p>Personal expense tracking with AI insights.</p>
      </div>
    </footer>
  );
}
