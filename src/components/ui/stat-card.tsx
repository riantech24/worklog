import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  footnote,
  emphasis = false,
}: {
  label: string;
  value: string;
  footnote?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-line bg-surface px-4 py-4">
      <p className="text-[13px] text-muted">{label}</p>
      <p
        className={cn(
          "numeric mt-2 text-[26px] font-semibold leading-none tracking-tight",
          emphasis ? "text-accent" : "text-ink",
        )}
      >
        {value}
      </p>
      {footnote ? <p className="mt-2 text-[12px] text-muted">{footnote}</p> : null}
    </div>
  );
}
