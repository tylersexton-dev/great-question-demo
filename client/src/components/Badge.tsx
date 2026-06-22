interface BadgeProps {
  label: string;
  variant: 'high' | 'medium' | 'low' | 'positive' | 'negative' | 'neutral' | 'mixed';
}

const styles: Record<BadgeProps['variant'], string> = {
  high: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-slate-50 text-slate-600 ring-slate-200',
  positive: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  negative: 'bg-red-50 text-red-700 ring-red-200',
  neutral: 'bg-slate-50 text-slate-600 ring-slate-200',
  mixed: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ring-inset ${styles[variant]}`}>
      {label}
    </span>
  );
}
