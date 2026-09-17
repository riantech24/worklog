import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Google Calendar settings" };

export default function Page() {
  return (
    <section aria-labelledby="section-title">
      <h3 id="section-title" className="mb-1 text-[16px] font-semibold text-ink">
        Google Calendar
      </h3>
      <p className="mb-5 max-w-prose text-sm text-muted">Connect the calendar Worklog reads events from, choose which calendars to sync, and refresh the connection when it expires.</p>
      <EmptyState title="Arrives in phase 4" description="Connect the calendar Worklog reads events from, choose which calendars to sync, and refresh the connection when it expires." />
    </section>
  );
}
