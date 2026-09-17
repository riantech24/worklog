import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Notifications settings" };

export default function Page() {
  return (
    <section aria-labelledby="section-title">
      <h3 id="section-title" className="mb-1 text-[16px] font-semibold text-ink">
        Notifications
      </h3>
      <p className="mb-5 max-w-prose text-sm text-muted">End-of-day reminders, unlogged event alerts, billing period warnings and outstanding invoice nudges.</p>
      <EmptyState title="Arrives in phase 10" description="End-of-day reminders, unlogged event alerts, billing period warnings and outstanding invoice nudges." />
    </section>
  );
}
