type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

const StatCard = ({ label, value, hint }: StatCardProps): JSX.Element => {
  return (
    <article className="rounded-xl border border-muted/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </article>
  );
};

export default StatCard;
