import Card from '@/components/ui/Card';

export default function StatCard({ label, value, subtext }) {
  return (
    <Card className="p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      {subtext && <p className="mt-1 text-sm text-muted">{subtext}</p>}
    </Card>
  );
}
