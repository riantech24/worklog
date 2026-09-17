import { PhasePlaceholder } from "@/components/shell/phase-placeholder";

export const metadata = { title: "Reports" };

export default function Page() {
  return (
    <PhasePlaceholder
      title="Reports"
      description="Work, billing, project and client summaries."
      phase={9}
      whatItWillDo="Working days, hours, tasks, billable days and revenue across any date range, client, project or category."
    />
  );
}
