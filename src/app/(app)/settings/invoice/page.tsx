import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Invoice settings" };

export default function Page() {
  return (
    <section aria-labelledby="section-title">
      <h3 id="section-title" className="mb-1 text-[16px] font-semibold text-ink">
        Invoice
      </h3>
      <p className="mb-5 max-w-prose text-sm text-muted">Your name, title, address, bank details, default declaration and invoice templates.</p>
      <EmptyState title="Arrives in phase 8" description="Your name, title, address, bank details, default declaration and invoice templates." />
    </section>
  );
}
