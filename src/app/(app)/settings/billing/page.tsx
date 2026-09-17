import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Billing settings" };

export default function Page() {
  return (
    <section aria-labelledby="section-title">
      <h3 id="section-title" className="mb-1 text-[16px] font-semibold text-ink">
        Billing
      </h3>
      <p className="mb-5 max-w-prose text-sm text-muted">Default billing type, rate, hours per working day and currency, used when you create a client or project.</p>
      <EmptyState title="Arrives in phase 2" description="Default billing type, rate, hours per working day and currency, used when you create a client or project." />
    </section>
  );
}
